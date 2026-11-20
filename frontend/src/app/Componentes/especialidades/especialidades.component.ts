import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, forkJoin } from 'rxjs';
import { Especialidad, EspecialidadRequest } from '../../modelos/especialidad';
import { EspecialidadService } from '../../Servicios/especialidad.service';
import { AuthService } from '../../Servicios/auth.service';
import { FieldErrorComponent } from '../../shared/field-error.component';
import { FeedbackComponent } from '../../shared/feedback.component';
import { hoyLocal, mensajeError, noFuturo, requerido } from '../../shared/form-utils';

@Component({
  selector: 'app-especialidades',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FieldErrorComponent, FeedbackComponent],
  templateUrl: './especialidades.component.html',
  styleUrl: './especialidades.component.scss',
})
export class EspecialidadesComponent implements OnInit {
  private fb = inject(FormBuilder);
  form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, requerido, Validators.maxLength(100)]],
    descripcion: ['', Validators.maxLength(255)],
    estado: [true],
  });
  lista: Especialidad[] = [];
  busqueda = '';
  cargando = false;
  guardando = false;
  error = '';
  exito = '';
  abierto = false;
  editando: number | null = null;
  porEliminar: Especialidad | null = null;
  hoy = hoyLocal();

  constructor(
    private service: EspecialidadService,
    public auth: AuthService,
  ) {}
  ngOnInit(): void {
    this.cargar();
  }
  get puedeEditar(): boolean {
    return this.auth.tieneRol('ADMIN');
  }
  get filtrados(): Especialidad[] {
    const texto = this.busqueda.trim().toLocaleLowerCase('es');
    return this.lista.filter((dato) =>
      `${dato.nombre} ${dato.descripcion ?? ''}`.toLocaleLowerCase('es').includes(texto),
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
  editar(dato: Especialidad): void {
    if (!this.puedeEditar || this.guardando) return;
    this.error = '';
    this.exito = '';
    this.editando = dato.idEspecialidad;
    this.abierto = true;

    this.form.reset({ ...dato, descripcion: dato.descripcion ?? '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  cancelar(): void {
    this.abierto = false;
    this.editando = null;
    this.form.reset({ nombre: '', descripcion: '', estado: true });
  }
  guardar(): void {
    if (this.guardando || !this.puedeEditar) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const datos: EspecialidadRequest = {
      nombre: v.nombre.trim(),
      descripcion: v.descripcion.trim() || null,
      estado: v.estado,
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
    const id = this.porEliminar.idEspecialidad;
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
  nombreEliminar(dato: Especialidad): string {
    return dato.nombre;
  }
}
