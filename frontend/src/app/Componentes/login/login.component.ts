import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../Servicios/auth.service';
import { FeedbackComponent } from '../../shared/feedback.component';
import { FieldErrorComponent } from '../../shared/field-error.component';
import { mensajeError, requerido } from '../../shared/form-utils';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FeedbackComponent, FieldErrorComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  form = this.fb.nonNullable.group({
    username: ['', [Validators.required, requerido]],
    password: ['', Validators.required],
  });
  error = '';
  enviando = false;
  visible = false;
  aviso = '';
  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}
  ngOnInit(): void {
    this.aviso =
      this.route.snapshot.queryParamMap.get('sesion') === 'expirada'
        ? 'Tu sesión terminó. Ingresa nuevamente.'
        : '';
    this.auth.asegurarSesion().subscribe((activa) => {
      if (activa) void this.router.navigateByUrl('/citas');
    });
  }
  ingresar(): void {
    if (this.enviando) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.enviando = true;
    this.error = '';
    const datos = this.form.getRawValue();
    datos.username = datos.username.trim();
    this.auth
      .login(datos)
      .pipe(finalize(() => (this.enviando = false)))
      .subscribe({
        next: () => {
          const destino = this.route.snapshot.queryParamMap.get('returnUrl');
          void this.router.navigateByUrl(
            destino?.startsWith('/') && !destino.startsWith('//') && !destino.startsWith('/login')
              ? destino
              : '/citas',
          );
        },
        error: (error) => (this.error = mensajeError(error)),
      });
  }
}
