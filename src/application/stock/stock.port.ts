import { StockConDetalle } from '../../domain/stock/stock.entity';

export interface GuardarStockInput {
  productoId: number;
  sucursalId: number;
  area?: string;
  cantidad?: number;
}

export interface StockRepositoryPort {
  listar(): Promise<StockConDetalle[]>;
  guardar(dto: GuardarStockInput): Promise<void>;
}
