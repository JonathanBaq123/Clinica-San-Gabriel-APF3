import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Especialidad, EspecialidadRequest } from '../modelos/especialidad';

@Injectable({ providedIn: 'root' })
export class EspecialidadService {
  private readonly url = `${environment.apiUrl}/especialidades`;
  constructor(private http: HttpClient) {}
  listar(): Observable<Especialidad[]> {
    return this.http.get<Especialidad[]>(this.url);
  }
  crear(datos: EspecialidadRequest): Observable<Especialidad> {
    return this.http.post<Especialidad>(this.url, datos);
  }
  actualizar(id: number, datos: EspecialidadRequest): Observable<Especialidad> {
    return this.http.put<Especialidad>(`${this.url}/${id}`, datos);
  }
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
