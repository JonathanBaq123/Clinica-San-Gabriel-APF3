import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Atencion, AtencionRequest } from '../modelos/atencion';

@Injectable({ providedIn: 'root' })
export class AtencionService {
  private readonly url = `${environment.apiUrl}/atenciones`;
  constructor(private http: HttpClient) {}
  listar(): Observable<Atencion[]> {
    return this.http.get<Atencion[]>(this.url);
  }
  crear(datos: AtencionRequest): Observable<Atencion> {
    return this.http.post<Atencion>(this.url, datos);
  }
  actualizar(id: number, datos: AtencionRequest): Observable<Atencion> {
    return this.http.put<Atencion>(`${this.url}/${id}`, datos);
  }
}
