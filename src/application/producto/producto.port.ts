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
  unidadesPorPaquete?: number;
  unidadesPorCaja?: number;
  ventaSoloPorPaquete?: boolean;
}

export interface ActualizarProductoInput {
  nombre?: string;
  nombresAlternativos?: string[];
  marca?: string;
  tipoProducto?: string;
  codigo?: string;
  unidadesPorPaquete?: number;
  unidadesPorCaja?: number;
  ventaSoloPorPaquete?: boolean;
}

export interface ResultadoImportacion {
  creados: number;
  errores: { fila: number; mensaje: string }[];
}

export interface ProductoRepositoryPort {
  listar(filtros: ProductoFiltros): Promise<Producto[]>;
  crear(dto: CrearProductoInput): Promise<Producto>;
  actualizar(id: number, dto: ActualizarProductoInput): Promise<Producto>;
  eliminar(id: number): Promise<Producto>;
  marcas(): Promise<string[]>;
  descargarPlantilla(): Promise<Blob>;
  importar(archivo: File): Promise<ResultadoImportacion>;
}
