import { StockConDetalle } from '../../domain/stock/stock.entity';

export interface GuardarStockInput {
  productoId: number;
  sucursalId: number;
  area?: string;
  cajas?: number;
  piezas?: number;
}

export interface ConfirmarStockInput {
  productoId: number;
  sucursalId: number;
  cantidad: number;
}

export interface StockRepositoryPort {
  listar(): Promise<StockConDetalle[]>;
  guardar(dto: GuardarStockInput): Promise<void>;
  confirmar(dto: ConfirmarStockInput): Promise<void>;
}
