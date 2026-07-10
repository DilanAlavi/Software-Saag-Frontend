export type EstadoVenta = 'PENDIENTE' | 'PAGADO' | 'CANCELADO';
export type MotivoCancelacion = 'NO_RECOGIO' | 'CLIENTE_CANCELO';

export interface DetalleVenta {
  id: number;
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
  entregado: boolean;
}

export interface Venta {
  id: number;
  cliente: { id: number; nombre: string; apellidoPaterno: string; celular: string };
  usuario: { id: number; nombre: string; apellidoPaterno: string };
  sucursal: { id: number; nombre: string };
  estado: EstadoVenta;
  motivoCancelacion: MotivoCancelacion | null;
  fecha: string;
  total: number;
  efectivoRecibido: number | null;
  vuelto: number | null;
  fechaPago: string | null;
  reporte: string | null;
  fechaReporte: string | null;
  detalles: DetalleVenta[];
}

export interface LineaCotizada {
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
}

export interface VentaCotizada {
  lineas: LineaCotizada[];
  total: number;
}

export const ETIQUETAS_ESTADO_VENTA: Record<EstadoVenta, string> = {
  PENDIENTE: 'Pendiente de pago',
  PAGADO: 'Pagado',
  CANCELADO: 'Cancelado',
};

export const ETIQUETAS_MOTIVO_CANCELACION: Record<MotivoCancelacion, string> = {
  NO_RECOGIO: 'El cliente no recogió el pedido',
  CLIENTE_CANCELO: 'El cliente canceló',
};
