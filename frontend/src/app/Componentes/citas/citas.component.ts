import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, forkJoin } from 'rxjs';
import { CitaRequest, CitaResponse, EstadoCita } from '../../modelos/cita';
import { Paciente } from '../../modelos/paciente';
import { Medico } from '../../modelos/medico';
import { Especialidad } from '../../modelos/especialidad';
import { CitaService } from '../../Servicios/cita.service';
import { PacienteService } from '../../Servicios/paciente.service';
import { MedicoService } from '../../Servicios/medico.service';
import { EspecialidadService } from '../../Servicios/especialidad.service';
import { AuthService } from '../../Servicios/auth.service';
import { FeedbackComponent } from '../../shared/feedback.component';
import { FieldErrorComponent } from '../../shared/field-error.component';
import { hoyLocal, mensajeError } from '../../shared/form-utils';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FeedbackComponent, FieldErrorComponent],
  templateUrl: './citas.component.html',
  styleUrl: './citas.component.scss',
})
export class CitasComponent implements OnInit {
  private fb = inject(FormBuilder);
  form = this.fb.nonNullable.group({
    idPaciente: [0, Validators.min(1)],
    idEspecialidad: [0, Validators.min(1)],
    idMedico: [0, Validators.min(1)],
    fechaCita: [hoyLocal(), Validators.required],
    horaCita: ['', Validators.required],
    motivoConsulta: ['', Validators.maxLength(255)],
  });
  citas: CitaResponse[] = [];
  pacientes: Paciente[] = [];
  medicos: Medico[] = [];
  especialidades: Especialidad[] = [];
  fechaFiltro = '';
  estadoFiltro = '';
  hoy = hoyLocal();
  error = '';
  exito = '';
  cargando = false;
  guardando = false;
  abierto = false;
  editando: number | null = null;
  porCancelar: CitaResponse | null = null;
  constructor(
    private service: CitaService,
    private pacienteService: PacienteService,
    private medicoService: MedicoService,
    private especialidadService: EspecialidadService,
    public auth: AuthService,
  ) {}
  ngOnInit(): void {
    this.cargar();
  }
  get puedeEditar(): boolean {
    return this.auth.tieneRol('ADMIN', 'RECEPCION');
  }
  get visibles(): CitaResponse[] {
    return this.citas.filter((c) => !this.estadoFiltro || c.estado === this.estadoFiltro);
  }
  get medicosDisponibles(): Medico[] {
    return this.medicos.filter(
      (m) =>
        m.estado &&
        m.especialidad.estado &&
        m.especialidad.idEspecialidad === this.form.controls.idEspecialidad.value,
    );
  }
  contar(estado: EstadoCita): number {
    return this.citas.filter((c) => c.estado === estado).length;
  }
  paciente(id: number): string {
    const p = this.pacientes.find((p) => p.idPaciente === id);
    return p ? `${p.nombres} ${p.apellidos}` : `Paciente #${id}`;
  }
  medico(id: number): string {
    const m = this.medicos.find((m) => m.idMedico === id);
    return m ? `${m.nombres} ${m.apellidos}` : `Médico #${id}`;
  }
  especialidad(idMedico: number): string {
    return this.medicos.find((m) => m.idMedico === idMedico)?.especialidad.nombre ?? '';
  }
  cargar(): void {
    this.cargando = true;
    this.error = '';
    forkJoin({
      citas: this.service.listar(this.fechaFiltro),
      pacientes: this.pacienteService.listar(),
      medicos: this.medicoService.listar(),
      especialidades: this.especialidadService.listar(),
    })
      .pipe(finalize(() => (this.cargando = false)))
      .subscribe({
        next: (datos) => {
          this.citas = datos.citas.sort((a, b) =>
            (a.fechaCita + a.horaCita).localeCompare(b.fechaCita + b.horaCita),
          );
          this.pacientes = datos.pacientes;
          this.medicos = datos.medicos;
          this.especialidades = datos.especialidades;
        },
        error: (error) => (this.error = mensajeError(error)),
      });
  }
  limpiarFiltros(): void {
    this.fechaFiltro = '';
    this.estadoFiltro = '';
    this.cargar();
  }
  cambiarEspecialidad(): void {
    this.form.controls.idMedico.setValue(0);
  }
  nuevo(): void {
    this.cancelarEdicion();
    this.error = '';
    this.exito = '';
    this.abierto = true;
  }
  editar(c: CitaResponse): void {
    if (!this.puedeEditar || this.guardando) return;
    this.editando = c.idCita;
    this.abierto = true;
    this.error = '';
    this.exito = '';
    this.form.reset({
      ...c,
      idEspecialidad:
        this.medicos.find((m) => m.idMedico === c.idMedico)?.especialidad.idEspecialidad ?? 0,
      motivoConsulta: c.motivoConsulta ?? '',
      horaCita: c.horaCita.slice(0, 5),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  cancelarEdicion(): void {
    this.abierto = false;
    this.editando = null;
    this.form.reset({
      idPaciente: 0,
      idEspecialidad: 0,
      idMedico: 0,
      fechaCita: hoyLocal(),
      horaCita: '',
      motivoConsulta: '',
    });
  }
  guardar(): void {
    if (this.guardando || !this.puedeEditar) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    if (new Date(`${v.fechaCita}T${v.horaCita}`).getTime() <= Date.now()) {
      this.error = 'Selecciona una fecha y hora futuras.';
      return;
    }
    const medico = this.medicosDisponibles.find((m) => m.idMedico === v.idMedico);
    if (!medico) {
      this.error = 'Selecciona un médico activo de la especialidad elegida.';
      return;
    }
    const datos: CitaRequest = {
      idPaciente: v.idPaciente,
      idMedico: v.idMedico,
      fechaCita: v.fechaCita,
      horaCita: v.horaCita.length === 5 ? v.horaCita + ':00' : v.horaCita,
      motivoConsulta: v.motivoConsulta.trim() || null,
    };
    this.guardando = true;
    this.error = '';
    this.exito = '';
    const peticion =
      this.editando === null
        ? this.service.crear(datos)
        : this.service.actualizar(this.editando, datos);
    peticion.pipe(finalize(() => (this.guardando = false))).subscribe({
      next: (cita) => {
        this.cancelarEdicion();
        this.fechaFiltro = cita.fechaCita;
        this.estadoFiltro = '';
        this.exito = `Cita #${cita.idCita} guardada.`;
        this.cargar();
      },
      error: (error) => (this.error = mensajeError(error)),
    });
  }
  cambiarEstado(c: CitaResponse, estado: EstadoCita): void {
    if (this.guardando || !this.puedeEditar) return;
    this.guardando = true;
    this.error = '';
    this.exito = '';
    this.service
      .cambiarEstado(c.idCita, estado)
      .pipe(
        finalize(() => {
          this.guardando = false;
          this.porCancelar = null;
        }),
      )
      .subscribe({
        next: () => {
          if (this.editando === c.idCita) this.cancelarEdicion();
          this.exito = `Cita #${c.idCita}: ${estado.toLowerCase()}.`;
          this.cargar();
        },
        error: (error) => (this.error = mensajeError(error)),
      });
  }
}
