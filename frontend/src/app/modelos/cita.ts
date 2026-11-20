import { Medico } from './medico';
import { Paciente } from './paciente';
export type EstadoCita = 'PENDIENTE' | 'CONFIRMADA' | 'ATENDIDA' | 'CANCELADA';
export interface CitaRequest {
  idPaciente: number;
  idMedico: number;
  fechaCita: string;
  horaCita: string;
  motivoConsulta: string | null;
}
export interface CitaResponse extends CitaRequest {
  idCita: number;
  estado: EstadoCita;
}
// /api/citas usa el DTO plano. /api/atenciones devuelve la cita anidada de la entidad.
export interface CitaDetalle {
  idCita: number;
  paciente: Paciente;
  medico: Medico;
  fechaCita: string;
  horaCita: string;
  motivoConsulta: string | null;
  estado: EstadoCita;
  fechaCreacion: string | null;
}
