import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../Servicios/auth.service';
import { Rol } from '../modelos/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.asegurarSesion().pipe(
    map((activo) => {
      if (!activo)
        return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
      const roles = route.data['roles'] as Rol[] | undefined;
      return !roles || auth.tieneRol(...roles) ? true : router.createUrlTree(['/sin-permiso']);
    }),
  );
};
