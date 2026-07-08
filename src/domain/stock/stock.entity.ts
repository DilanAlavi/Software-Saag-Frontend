export interface StockConDetalle {
  id: number;
  productoId: number;
  productoNombre: string;
  productoCodigo: string | null;
  sucursalId: number;
  sucursalNombre: string;
  sucursalTipo: string;
  area: string | null;
  cantidad: number | null;
}
