import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Medico, MedicoRequest } from '../modelos/medico';

@Injectable({ providedIn: 'root' })
export class MedicoService {
  private readonly url = `${environment.apiUrl}/medicos`;
  constructor(private http: HttpClient) {}
  listar(idEspecialidad?: number): Observable<Medico[]> {
    return this.http.get<Medico[]>(this.url, { params: idEspecialidad ? { idEspecialidad } : {} });
  }
  crear(datos: MedicoRequest): Observable<Medico> {
    return this.http.post<Medico>(this.url, datos);
  }
  actualizar(id: number, datos: MedicoRequest): Observable<Medico> {
    return this.http.put<Medico>(`${this.url}/${id}`, datos);
  }
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
