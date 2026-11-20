import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-sin-permiso',
  standalone: true,
  imports: [RouterLink],
  template: `<section class="empty-state">
    <span class="eyebrow">ACCESO RESTRINGIDO</span>
    <h1 class="mt-3">No tienes permiso para esta sección</h1>
    <p>Tu sesión sigue activa. Puedes volver a la agenda.</p>
    <a routerLink="/citas" class="btn btn-primary">Ir a citas</a>
  </section>`,
})
export class SinPermisoComponent {}
