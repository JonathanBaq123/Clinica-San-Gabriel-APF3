export type Rol = 'ADMIN' | 'RECEPCION' | 'MEDICO';
export interface LoginRequest {
  username: string;
  password: string;
}
export interface LoginResponse {
  token: string;
}
export interface Perfil {
  id: number;
  username: string;
  rol: Rol;
  activo: boolean;
}
