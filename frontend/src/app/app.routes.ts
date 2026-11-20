import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { MenuComponent } from './Componentes/menu/menu.component';
export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./Componentes/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    component: MenuComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'citas' },
      {
        path: 'citas',
        canActivate: [authGuard],
        data: { roles: ['ADMIN', 'RECEPCION', 'MEDICO'] },
        loadComponent: () =>
          import('./Componentes/citas/citas.component').then((m) => m.CitasComponent),
      },
      {
        path: 'pacientes',
        canActivate: [authGuard],
        data: { roles: ['ADMIN', 'RECEPCION', 'MEDICO'] },
        loadComponent: () =>
          import('./Componentes/pacientes/pacientes.component').then((m) => m.PacientesComponent),
      },
      {
        path: 'medicos',
        canActivate: [authGuard],
        data: { roles: ['ADMIN', 'RECEPCION', 'MEDICO'] },
        loadComponent: () =>
          import('./Componentes/medicos/medicos.component').then((m) => m.MedicosComponent),
      },
      {
        path: 'especialidades',
        canActivate: [authGuard],
        data: { roles: ['ADMIN', 'RECEPCION', 'MEDICO'] },
        loadComponent: () =>
          import('./Componentes/especialidades/especialidades.component').then(
            (m) => m.EspecialidadesComponent,
          ),
      },
      {
        path: 'atenciones',
        canActivate: [authGuard],
        data: { roles: ['ADMIN', 'MEDICO'] },
        loadComponent: () =>
          import('./Componentes/atenciones/atenciones.component').then(
            (m) => m.AtencionesComponent,
          ),
      },
      {
        path: 'sin-permiso',
        loadComponent: () =>
          import('./Componentes/sin-permiso/sin-permiso.component').then(
            (m) => m.SinPermisoComponent,
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'citas' },
];
