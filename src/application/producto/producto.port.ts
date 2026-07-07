import { Producto } from '../../domain/producto/producto.entity';

export interface ProductoFiltros {
  search?: string;
  tipoProducto?: string;
}

export interface CrearProductoInput {
  nombre: string;
  nombresAlternativos?: string[];
  marca?: string;
  tipoProducto: string;
  codigo?: string;
  cantidad?: number;
  precioCosto?: number;
}

export interface ProductoRepositoryPort {
  listar(filtros: ProductoFiltros): Promise<Producto[]>;
  crear(dto: CrearProductoInput): Promise<Producto>;
  eliminar(id: number): Promise<Producto>;
}
