export interface Paciente {
  idPaciente: number;
  dni: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
  sexo: 'M' | 'F' | null;
  telefono: string | null;
  correo: string | null;
  direccion: string | null;
  fechaRegistro: string | null;
}
export type PacienteRequest = Omit<Paciente, 'idPaciente' | 'fechaRegistro'>;
