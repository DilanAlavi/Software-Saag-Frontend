export type RolCliente =
  | 'MAYOR_1'
  | 'MAYOR_2'
  | 'STANDARD_1'
  | 'STANDARD_2'
  | 'CARPINTERIA'
  | 'PLOMERIA'
  | 'ELECTRICISTA';

export interface GrupoDeCliente {
  id: number;
  nombre: string;
  categoriaAsignada: string;
}

export interface Cliente {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string | null;
  ci: string | null;
  celular: string;
  genero: string | null;
  rol: RolCliente;
  estado: boolean;
  fechaRegistro?: string;
  grupos: GrupoDeCliente[];
}

export const ETIQUETAS_ROL_CLIENTE: Record<RolCliente, string> = {
  MAYOR_1: 'Cliente Mayor 1',
  MAYOR_2: 'Cliente Mayor 2',
  STANDARD_1: 'Cliente Standard 1',
  STANDARD_2: 'Cliente Standard 2',
  CARPINTERIA: 'Carpintero',
  PLOMERIA: 'Plomero',
  ELECTRICISTA: 'Electricista',
};
