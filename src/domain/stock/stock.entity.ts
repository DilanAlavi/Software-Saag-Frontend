export interface StockConDetalle {
  id: number;
  productoId: number;
  productoNombre: string;
  productoCodigo: string | null;
  unidadesPorCaja: number | null;
  unidadesPorPaquete: number | null;
  ventaSoloPorPaquete: boolean;
  sucursalId: number;
  sucursalNombre: string;
  sucursalTipo: string;
  area: string | null;
  unidadesTotales: number | null;
  cajas: number | null;
  paquetes: number | null;
  piezasSueltas: number | null;
  confirmado: boolean;
  cantidadVendidaAcumulada: number;
}
