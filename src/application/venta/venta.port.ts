import { Venta, VentaCotizada } from '../../domain/venta/venta.entity';

export interface LineaVentaInput {
  productoId: number;
  cantidad: number;
}

export interface CotizarVentaInput {
  clienteId: number;
  sucursalId?: number;
  lineas: LineaVentaInput[];
}

export interface CrearVentaInput {
  clienteId: number;
  sucursalId?: number;
  lineas: LineaVentaInput[];
  pagarAhora: boolean;
  efectivoRecibido?: number;
}

export interface VentaFiltros {
  estado?: string;
  sucursalId?: number;
  fecha?: string;
  search?: string;
  searchTipo?: 'cliente' | 'vendedor';
  page?: number;
  pageSize?: number;
}

export interface VentaListado {
  ventas: Venta[];
  total: number;
}

export interface VentaRepositoryPort {
  cotizar(dto: CotizarVentaInput): Promise<VentaCotizada>;
  crear(dto: CrearVentaInput): Promise<Venta>;
  listar(filtros: VentaFiltros): Promise<VentaListado>;
  obtener(id: number): Promise<Venta>;
  pagar(id: number, efectivoRecibido: number): Promise<Venta>;
  cancelar(id: number, motivo: string): Promise<Venta>;
  entregar(id: number, detalleIds: number[]): Promise<Venta>;
  reportar(id: number, mensaje: string): Promise<Venta>;
  descargarProforma(id: number): Promise<Blob>;
}
