import { Sucursal } from '../sucursal/sucursal.entity';

export type RolUsuario = 'ADMIN' | 'ADMIN_SUCURSAL' | 'VENDEDOR';

export interface Usuario {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string | null;
  rol: RolUsuario;
  estado: boolean;
  sucursal: Sucursal | null;
}
