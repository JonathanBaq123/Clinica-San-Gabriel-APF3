import { Especialidad } from './especialidad';
export interface Medico {
  idMedico: number;
  dni: string;
  nombres: string;
  apellidos: string;
  cmp: string;
  telefono: string | null;
  correo: string | null;
  especialidad: Especialidad;
  estado: boolean;
}
export type MedicoRequest = Omit<Medico, 'idMedico' | 'especialidad'> & {
  especialidad: { idEspecialidad: number };
};
