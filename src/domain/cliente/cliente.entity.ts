import { Sucursal } from '../sucursal/sucursal.entity';

export type RolCliente =
  | 'MAYOR_1'
  | 'MAYOR_2'
  | 'REGULAR'
  | 'REGULAR_2'
  | 'CARPINTERO'
  | 'PLOMERO';

export interface Cliente {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string | null;
  rol: RolCliente;
  estado: boolean;
  sucursal: Sucursal | null;
}

export const ETIQUETAS_ROL_CLIENTE: Record<RolCliente, string> = {
  MAYOR_1: 'Cliente Mayor 1',
  MAYOR_2: 'Cliente Mayor 2',
  REGULAR: 'Cliente Regular',
  REGULAR_2: 'Cliente Regular 2',
  CARPINTERO: 'Carpintero',
  PLOMERO: 'Plomero',
};
