import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, forkJoin } from 'rxjs';
import { Atencion, AtencionRequest } from '../../modelos/atencion';
import { CitaResponse } from '../../modelos/cita';
import { Paciente } from '../../modelos/paciente';
import { Medico } from '../../modelos/medico';
import { AtencionService } from '../../Servicios/atencion.service';
import { CitaService } from '../../Servicios/cita.service';
import { PacienteService } from '../../Servicios/paciente.service';
import { MedicoService } from '../../Servicios/medico.service';
import { FeedbackComponent } from '../../shared/feedback.component';
import { FieldErrorComponent } from '../../shared/field-error.component';
import { mensajeError, requerido } from '../../shared/form-utils';

@Component({
  selector: 'app-atenciones',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FeedbackComponent, FieldErrorComponent],
  templateUrl: './atenciones.component.html',
  styleUrl: './atenciones.component.scss',
})
export class AtencionesComponent implements OnInit {
  private fb = inject(FormBuilder);
  form = this.fb.nonNullable.group({
    idCita: [0, Validators.min(1)],
    signosVitales: ['', Validators.maxLength(255)],
    diagnostico: ['', [Validators.required, requerido, Validators.maxLength(10000)]],
    tratamientoReceta: ['', Validators.maxLength(10000)],
    observaciones: ['', Validators.maxLength(10000)],
  });
  lista: Atencion[] = [];
  citas: CitaResponse[] = [];
  pacientes: Paciente[] = [];
  medicos: Medico[] = [];
  busqueda = '';
  error = '';
  exito = '';
  cargando = false;
  guardando = false;
  abierto = false;
  editando: number | null = null;
  detalle: Atencion | null = null;
  constructor(
    private service: AtencionService,
    private citaService: CitaService,
    private pacienteService: PacienteService,
    private medicoService: MedicoService,
  ) {}
  ngOnInit(): void {
    this.cargar();
  }
  get disponibles(): CitaResponse[] {
    return this.citas.filter(
      (c) =>
        c.estado === 'PENDIENTE' ||
        c.estado === 'CONFIRMADA' ||
        c.idCita === this.form.controls.idCita.value,
    );
  }
  get filtrados(): Atencion[] {
    const texto = this.busqueda.trim().toLocaleLowerCase('es');
    return this.lista.filter((a) =>
      `${a.cita.paciente.nombres} ${a.cita.paciente.apellidos} ${a.cita.paciente.dni} ${a.diagnostico} ${a.idAtencion}`
        .toLocaleLowerCase('es')
        .includes(texto),
    );
  }
  etiqueta(c: CitaResponse): string {
    const p = this.pacientes.find((p) => p.idPaciente === c.idPaciente);
    const m = this.medicos.find((m) => m.idMedico === c.idMedico);
    return `#${c.idCita} · ${c.fechaCita} ${c.horaCita.slice(0, 5)} · ${p?.nombres ?? ''} ${p?.apellidos ?? ''} · Dr(a). ${m?.apellidos ?? c.idMedico}`;
  }
  cargar(): void {
    this.cargando = true;
    this.error = '';
    forkJoin({
      atenciones: this.service.listar(),
      citas: this.citaService.listar(),
      pacientes: this.pacienteService.listar(),
      medicos: this.medicoService.listar(),
    })
      .pipe(finalize(() => (this.cargando = false)))
      .subscribe({
        next: (datos) => {
          this.lista = datos.atenciones.sort((a, b) => b.idAtencion - a.idAtencion);
          this.citas = datos.citas;
          this.pacientes = datos.pacientes;
          this.medicos = datos.medicos;
        },
        error: (error) => (this.error = mensajeError(error)),
      });
  }
  nuevo(): void {
    this.cancelar();
    this.detalle = null;
    this.error = '';
    this.exito = '';
    this.abierto = true;
  }
  editar(a: Atencion): void {
    if (this.guardando) return;
    this.editando = a.idAtencion;
    this.abierto = true;
    this.detalle = null;
    this.error = '';
    this.exito = '';
    this.form.reset({
      idCita: a.cita.idCita,
      signosVitales: a.signosVitales ?? '',
      diagnostico: a.diagnostico,
      tratamientoReceta: a.tratamientoReceta ?? '',
      observaciones: a.observaciones ?? '',
    });
    this.form.controls.idCita.disable();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  cancelar(): void {
    this.abierto = false;
    this.editando = null;
    this.form.controls.idCita.enable();
    this.form.reset({
      idCita: 0,
      signosVitales: '',
      diagnostico: '',
      tratamientoReceta: '',
      observaciones: '',
    });
  }
  guardar(): void {
    if (this.guardando) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const datos: AtencionRequest = {
      cita: { idCita: v.idCita },
      diagnostico: v.diagnostico.trim(),
      signosVitales: v.signosVitales.trim() || null,
      tratamientoReceta: v.tratamientoReceta.trim() || null,
      observaciones: v.observaciones.trim() || null,
    };
    this.guardando = true;
    this.error = '';
    this.exito = '';
    const peticion =
      this.editando === null
        ? this.service.crear(datos)
        : this.service.actualizar(this.editando, datos);
    peticion.pipe(finalize(() => (this.guardando = false))).subscribe({
      next: (a) => {
        this.cancelar();
        this.exito = `Atención #${a.idAtencion} guardada. La cita figura como atendida.`;
        this.cargar();
      },
      error: (error) => (this.error = mensajeError(error)),
    });
  }
}
