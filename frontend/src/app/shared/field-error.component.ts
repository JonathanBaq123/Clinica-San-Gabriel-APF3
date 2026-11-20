import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-field-error',
  standalone: true,
  template: `@if (control?.invalid && control?.touched) {
    <div class="field-error" role="alert">{{ mensaje }}</div>
  }`,
})
export class FieldErrorComponent {
  @Input({ required: true }) control: AbstractControl | null = null;
  get mensaje(): string {
    const e = this.control?.errors ?? {};
    if (e['required']) return 'Completa este campo.';
    if (e['email']) return 'Escribe un correo válido.';
    if (e['pattern']) return 'Revisa el formato indicado para este campo.';
    if (e['maxlength']) return `Máximo ${e['maxlength'].requiredLength} caracteres.`;
    if (e['min']) return 'Selecciona una opción.';
    if (e['futuro']) return 'La fecha de nacimiento no puede ser futura.';
    return 'Revisa este campo.';
  }
}
