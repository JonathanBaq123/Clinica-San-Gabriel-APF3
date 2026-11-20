import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../Servicios/auth.service';
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  abierto = false;
  constructor(
    public auth: AuthService,
    private router: Router,
  ) {}
  salir(): void {
    this.auth.limpiarSesion();
    void this.router.navigateByUrl('/login');
  }
}
