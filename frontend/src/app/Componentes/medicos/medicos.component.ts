import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, forkJoin } from 'rxjs';
import { Medico, MedicoRequest } from '../../modelos/medico';
import { MedicoService } from '../../Servicios/medico.service';
import { AuthService } from '../../Servicios/auth.service';
import { FieldErrorComponent } from '../../shared/field-error.component';
import { FeedbackComponent } from '../../shared/feedback.component';
import { hoyLocal, mensajeError, noFuturo, requerido } from '../../shared/form-utils';
import { EspecialidadService } from '../../Servicios/especialidad.service';
import { Especialidad } from '../../modelos/especialidad';

@Component({
  selector: 'app-medicos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FieldErrorComponent, FeedbackComponent],
  templateUrl: './medicos.component.html',
  styleUrl: './medicos.component.scss',
})
export class MedicosComponent implements OnInit {
  private fb = inject(FormBuilder);
  form = this.fb.nonNullable.group({
    dni: ['', [Validators.required, Validators.pattern('[0-9]{8}')]],
    nombres: ['', [Validators.required, requerido, Validators.maxLength(100)]],
    apellidos: ['', [Validators.required, requerido, Validators.maxLength(100)]],
    cmp: ['', [Validators.required, requerido, Validators.maxLength(20)]],
    telefono: ['', Validators.maxLength(15)],
    correo: ['', [Validators.email, Validators.maxLength(100)]],
    idEspecialidad: [0, Validators.min(1)],
    estado: [true],
  });
  lista: Medico[] = [];
  busqueda = '';
  cargando = false;
  guardando = false;
  error = '';
  exito = '';
  abierto = false;
  editando: number | null = null;
  porEliminar: Medico | null = null;
  hoy = hoyLocal();
  especialidades: Especialidad[] = [];
  especialidadOriginal = 0;
  constructor(
    private service: MedicoService,
    public auth: AuthService,
    private especialidadService: EspecialidadService,
  ) {}
  ngOnInit(): void {
    this.cargar();
  }
  get puedeEditar(): boolean {
    return this.auth.tieneRol('ADMIN');
  }
  get filtrados(): Medico[] {
    const texto = this.busqueda.trim().toLocaleLowerCase('es');
    return this.lista.filter((dato) =>
      `${dato.nombres} ${dato.apellidos} ${dato.dni} ${dato.cmp} ${dato.especialidad.nombre}`
        .toLocaleLowerCase('es')
        .includes(texto),
    );
  }
  cargar(): void {
    this.cargando = true;
    this.error = '';
    forkJoin({ lista: this.service.listar(), especialidades: this.especialidadService.listar() })
      .pipe(finalize(() => (this.cargando = false)))
      .subscribe({
        next: (res) => {
          this.lista = res.lista;
          this.especialidades = res.especialidades;
        },
        error: (error) => (this.error = mensajeError(error)),
      });
  }
  nuevo(): void {
    this.cancelar();
    this.error = '';
    this.exito = '';
    this.abierto = true;
  }
  editar(dato: Medico): void {
    if (!this.puedeEditar || this.guardando) return;
    this.error = '';
    this.exito = '';
    this.editando = dato.idMedico;
    this.abierto = true;
    this.especialidadOriginal = dato.especialidad.idEspecialidad;
    this.form.reset({
      ...dato,
      telefono: dato.telefono ?? '',
      correo: dato.correo ?? '',
      idEspecialidad: dato.especialidad.idEspecialidad,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  cancelar(): void {
    this.abierto = false;
    this.editando = null;
    this.form.reset({
      dni: '',
      nombres: '',
      apellidos: '',
      cmp: '',
      telefono: '',
      correo: '',
      idEspecialidad: 0,
      estado: true,
    });
    this.especialidadOriginal = 0;
  }
  guardar(): void {
    if (this.guardando || !this.puedeEditar) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const datos: MedicoRequest = {
      dni: v.dni.trim(),
      nombres: v.nombres.trim(),
      apellidos: v.apellidos.trim(),
      cmp: v.cmp.trim(),
      telefono: v.telefono.trim() || null,
      correo: v.correo.trim() || null,
      estado: v.estado,
      especialidad: { idEspecialidad: v.idEspecialidad },
    };
    this.guardando = true;
    this.error = '';
    this.exito = '';
    const peticion =
      this.editando === null
        ? this.service.crear(datos)
        : this.service.actualizar(this.editando, datos);
    peticion.pipe(finalize(() => (this.guardando = false))).subscribe({
      next: () => {
        this.cancelar();
        this.exito = 'Registro guardado.';
        this.cargar();
      },
      error: (error) => (this.error = mensajeError(error)),
    });
  }
  confirmarEliminar(): void {
    if (!this.porEliminar || this.guardando || !this.puedeEditar) return;
    const id = this.porEliminar.idMedico;
    this.guardando = true;
    this.error = '';
    this.exito = '';
    this.service
      .eliminar(id)
      .pipe(
        finalize(() => {
          this.guardando = false;
          this.porEliminar = null;
        }),
      )
      .subscribe({
        next: () => {
          if (this.editando === id) this.cancelar();
          this.exito = 'Registro eliminado.';
          this.cargar();
        },
        error: (error) => (this.error = mensajeError(error)),
      });
  }
  nombreEliminar(dato: Medico): string {
    return dato.nombres + ' ' + dato.apellidos;
  }
}
