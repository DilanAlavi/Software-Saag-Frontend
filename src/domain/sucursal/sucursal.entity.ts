export type TipoUbicacion = 'CENTRAL' | 'SUCURSAL' | 'DEPOSITO';
export type ModalidadVentaPaquete = 'PIEZA' | 'PAQUETE' | 'AMBOS';

export interface Sucursal {
  id: number;
  nombre: string;
  tipo: TipoUbicacion;
  departamento: string | null;
  ciudad: string | null;
  zona: string | null;
  referencia: string | null;
  estado: boolean;
  modalidadVentaPaquete: ModalidadVentaPaquete | null;
}

export const ETIQUETAS_TIPO_UBICACION: Record<TipoUbicacion, string> = {
  CENTRAL: 'Central',
  SUCURSAL: 'Sucursal',
  DEPOSITO: 'Depósito',
};

export const ETIQUETAS_MODALIDAD_VENTA: Record<ModalidadVentaPaquete, string> = {
  PIEZA: 'Solo pieza suelta',
  PAQUETE: 'Solo paquete cerrado',
  AMBOS: 'Pieza y paquete',
};
