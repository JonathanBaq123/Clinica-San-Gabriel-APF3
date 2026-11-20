import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../Servicios/auth.service';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const esApi = request.url.startsWith(`${environment.apiUrl}/`);
  const esLogin = request.url === `${environment.apiUrl}/auth/login`;
  const token = auth.token();
  const peticion =
    esApi && !esLogin && token
      ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : request;
  return next(peticion).pipe(
    catchError((error: HttpErrorResponse) => {
      if (esApi && !esLogin && error.status === 401) {
        auth.limpiarSesion();
        void router.navigate(['/login'], { queryParams: { sesion: 'expirada' } });
      }
      return throwError(() => error);
    }),
  );
};
