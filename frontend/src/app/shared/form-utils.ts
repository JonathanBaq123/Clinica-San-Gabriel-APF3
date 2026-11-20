import { AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

export function requerido(control: AbstractControl): ValidationErrors | null {
  return typeof control.value === 'string' && !control.value.trim() ? { required: true } : null;
}
export function hoyLocal(): string {
  const fecha = new Date();
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
}
export function noFuturo(control: AbstractControl): ValidationErrors | null {
  return control.value && control.value > hoyLocal() ? { futuro: true } : null;
}
export function mensajeError(error: unknown): string {
  if (!(error instanceof HttpErrorResponse)) return 'No se pudo completar la operación.';
  if (error.status === 0)
    return 'No hay conexión con el servidor. Comprueba que Spring Boot esté iniciado en el puerto 8080 y que CORS permita localhost:4200.';
  if (error.status === 401)
    return 'Credenciales incorrectas o sesión vencida. Vuelve a iniciar sesión.';
  if (error.status === 403) return 'Tu usuario no tiene permisos para esta operación.';
  if (typeof error.error?.message === 'string') return error.error.message;
  if (typeof error.error?.detail === 'string') return error.error.detail;
  return (
    (
      {
        400: 'Revisa los datos del formulario.',
        404: 'El registro ya no existe. Actualiza la lista.',
        409: 'Hay datos duplicados o registros vinculados.',
      } as Record<number, string>
    )[error.status] ?? 'Ocurrió un error en el servidor. Inténtalo nuevamente.'
  );
}
