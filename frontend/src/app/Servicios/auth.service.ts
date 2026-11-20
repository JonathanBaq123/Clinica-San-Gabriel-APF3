import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, shareReplay, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, Perfil, Rol } from '../modelos/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'san-gabriel-token';
  private readonly perfilActual = signal<Perfil | null>(null);
  readonly perfil = this.perfilActual.asReadonly();
  private recuperacion?: Observable<boolean>;
  constructor(private http: HttpClient) {}

  token(): string | null {
    const token = sessionStorage.getItem(this.tokenKey);
    if (!token) return null;
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')));
      return typeof payload.exp === 'number' && payload.exp * 1000 > Date.now() ? token : null;
    } catch {
      return null;
    }
  }
  login(datos: LoginRequest): Observable<Perfil> {
    this.limpiarSesion();
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, datos).pipe(
      tap((respuesta) => sessionStorage.setItem(this.tokenKey, respuesta.token)),
      switchMap(() => this.http.get<Perfil>(`${environment.apiUrl}/usuarios/me`)),
      tap((perfil) => this.perfilActual.set(perfil)),
      catchError((error) => {
        this.limpiarSesion();
        return throwError(() => error);
      }),
    );
  }
  asegurarSesion(): Observable<boolean> {
    if (!this.token()) {
      this.limpiarSesion();
      return of(false);
    }
    if (this.perfilActual()) return of(true);
    if (!this.recuperacion) {
      this.recuperacion = this.http.get<Perfil>(`${environment.apiUrl}/usuarios/me`).pipe(
        tap((perfil) => this.perfilActual.set(perfil)),
        map((perfil) => perfil.activo),
        catchError(() => {
          this.limpiarSesion();
          return of(false);
        }),
        shareReplay({ bufferSize: 1, refCount: true }),
      );
    }
    return this.recuperacion;
  }
  tieneRol(...roles: Rol[]): boolean {
    const perfil = this.perfilActual();
    return !!perfil && perfil.activo && roles.includes(perfil.rol);
  }
  limpiarSesion(): void {
    sessionStorage.removeItem(this.tokenKey);
    this.perfilActual.set(null);
    this.recuperacion = undefined;
  }
}
