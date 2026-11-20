import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-feedback',
  standalone: true,
  template: `
    @if (error) {
      <div class="alert alert-danger" role="alert">{{ error }}</div>
    }
    @if (exito) {
      <div class="alert alert-success" role="status">{{ exito }}</div>
    }
    @if (cargando) {
      <div class="loading-state" role="status">
        <span class="spinner-border spinner-border-sm" aria-hidden="true"></span> Cargando datos…
      </div>
    }
  `,
})
export class FeedbackComponent {
  @Input() error = '';
  @Input() exito = '';
  @Input() cargando = false;
}
