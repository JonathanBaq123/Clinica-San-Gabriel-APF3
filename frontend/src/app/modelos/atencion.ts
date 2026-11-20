import { CitaDetalle } from './cita';
export interface Atencion {
  idAtencion: number;
  cita: CitaDetalle;
  fechaHoraAtencion: string | null;
  signosVitales: string | null;
  diagnostico: string;
  tratamientoReceta: string | null;
  observaciones: string | null;
}
export interface AtencionRequest {
  cita: { idCita: number };
  signosVitales: string | null;
  diagnostico: string;
  tratamientoReceta: string | null;
  observaciones: string | null;
}
