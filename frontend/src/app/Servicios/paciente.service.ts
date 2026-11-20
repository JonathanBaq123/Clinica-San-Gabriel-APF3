import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Paciente, PacienteRequest } from '../modelos/paciente';

@Injectable({ providedIn: 'root' })
export class PacienteService {
  private readonly url = `${environment.apiUrl}/pacientes`;
  constructor(private http: HttpClient) {}
  listar(dni = ''): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(this.url, { params: dni ? { dni } : {} });
  }
  crear(datos: PacienteRequest): Observable<Paciente> {
    return this.http.post<Paciente>(this.url, datos);
  }
  actualizar(id: number, datos: PacienteRequest): Observable<Paciente> {
    return this.http.put<Paciente>(`${this.url}/${id}`, datos);
  }
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
