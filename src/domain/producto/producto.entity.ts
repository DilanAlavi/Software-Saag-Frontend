export type TipoProducto = 'CARPINTERIA' | 'FERRETERIA' | 'PLOMERIA' | 'ELECTRICO';

export interface Producto {
  id: number;
  nombre: string;
  nombresAlternativos: string[];
  marca: string | null;
  tipoProducto: TipoProducto;
  codigo: string | null;
  estado: boolean;
  fechaRegistro: string;
  unidadesPorPaquete: number | null;
  unidadesPorCaja: number | null;
  ventaSoloPorPaquete: boolean;
  unidadVenta: string | null;
  unidadVentaTamano: number | null;
  redondeoSiempreArriba: boolean;
  notaVenta: string | null;
}

export const ETIQUETAS_TIPO_PRODUCTO: Record<TipoProducto, string> = {
  CARPINTERIA: 'Carpintería',
  FERRETERIA: 'Ferretería',
  PLOMERIA: 'Plomería',
  ELECTRICO: 'Eléctrico',
};
