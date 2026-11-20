import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CitaRequest, CitaResponse, EstadoCita } from '../modelos/cita';

@Injectable({ providedIn: 'root' })
export class CitaService {
  private readonly url = `${environment.apiUrl}/citas`;
  constructor(private http: HttpClient) {}
  listar(fecha = ''): Observable<CitaResponse[]> {
    return this.http.get<CitaResponse[]>(this.url, { params: fecha ? { fecha } : {} });
  }
  crear(datos: CitaRequest): Observable<CitaResponse> {
    return this.http.post<CitaResponse>(this.url, datos);
  }
  actualizar(id: number, datos: CitaRequest): Observable<CitaResponse> {
    return this.http.put<CitaResponse>(`${this.url}/${id}`, datos);
  }
  cambiarEstado(id: number, nuevoEstado: EstadoCita): Observable<CitaResponse> {
    return this.http.patch<CitaResponse>(`${this.url}/${id}/estado`, null, {
      params: { nuevoEstado },
    });
  }
}
