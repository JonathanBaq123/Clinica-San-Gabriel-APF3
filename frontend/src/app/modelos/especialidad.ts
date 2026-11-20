export interface Especialidad {
  idEspecialidad: number;
  nombre: string;
  descripcion: string | null;
  estado: boolean;
}
export type EspecialidadRequest = Omit<Especialidad, 'idEspecialidad'>;
