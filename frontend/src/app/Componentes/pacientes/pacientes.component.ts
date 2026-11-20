import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, forkJoin } from 'rxjs';
import { Paciente, PacienteRequest } from '../../modelos/paciente';
import { PacienteService } from '../../Servicios/paciente.service';
import { AuthService } from '../../Servicios/auth.service';
import { FieldErrorComponent } from '../../shared/field-error.component';
import { FeedbackComponent } from '../../shared/feedback.component';
import { hoyLocal, mensajeError, noFuturo, requerido } from '../../shared/form-utils';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FieldErrorComponent, FeedbackComponent],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.scss',
})
export class PacientesComponent implements OnInit {
  private fb = inject(FormBuilder);
  form = this.fb.nonNullable.group({
    dni: ['', [Validators.required, Validators.pattern('[0-9]{8}')]],
    nombres: ['', [Validators.required, requerido, Validators.maxLength(100)]],
    apellidos: ['', [Validators.required, requerido, Validators.maxLength(100)]],
    fechaNacimiento: ['', [Validators.required, noFuturo]],
    sexo: [''],
    telefono: ['', Validators.maxLength(15)],
    correo: ['', [Validators.email, Validators.maxLength(100)]],
    direccion: ['', Validators.maxLength(200)],
  });
  lista: Paciente[] = [];
  busqueda = '';
  cargando = false;
  guardando = false;
  error = '';
  exito = '';
  abierto = false;
  editando: number | null = null;
  porEliminar: Paciente | null = null;
  hoy = hoyLocal();

  constructor(
    private service: PacienteService,
    public auth: AuthService,
  ) {}
  ngOnInit(): void {
    this.cargar();
  }
  get puedeEditar(): boolean {
    return this.auth.tieneRol('ADMIN', 'RECEPCION');
  }
  get filtrados(): Paciente[] {
    const texto = this.busqueda.trim().toLocaleLowerCase('es');
    return this.lista.filter((dato) =>
      `${dato.nombres} ${dato.apellidos} ${dato.dni}`.toLocaleLowerCase('es').includes(texto),
    );
  }
  cargar(): void {
    this.cargando = true;
    this.error = '';
    this.service
      .listar()
      .pipe(finalize(() => (this.cargando = false)))
      .subscribe({
        next: (datos) => (this.lista = datos),
        error: (error) => (this.error = mensajeError(error)),
      });
  }
  nuevo(): void {
    this.cancelar();
    this.error = '';
    this.exito = '';
    this.abierto = true;
  }
  editar(dato: Paciente): void {
    if (!this.puedeEditar || this.guardando) return;
    this.error = '';
    this.exito = '';
    this.editando = dato.idPaciente;
    this.abierto = true;

    this.form.reset({
      ...dato,
      sexo: dato.sexo ?? '',
      telefono: dato.telefono ?? '',
      correo: dato.correo ?? '',
      direccion: dato.direccion ?? '',
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
      fechaNacimiento: '',
      sexo: '',
      telefono: '',
      correo: '',
      direccion: '',
    });
  }
  guardar(): void {
    if (this.guardando || !this.puedeEditar) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const datos: PacienteRequest = {
      ...v,
      dni: v.dni.trim(),
      nombres: v.nombres.trim(),
      apellidos: v.apellidos.trim(),
      sexo: v.sexo === 'M' || v.sexo === 'F' ? v.sexo : null,
      telefono: v.telefono.trim() || null,
      correo: v.correo.trim() || null,
      direccion: v.direccion.trim() || null,
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
    const id = this.porEliminar.idPaciente;
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
  nombreEliminar(dato: Paciente): string {
    return dato.nombres + ' ' + dato.apellidos;
  }
}
