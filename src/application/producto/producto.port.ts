import { NuevoProducto, Producto } from '../../domain/producto/producto.entity';

export interface ProductoRepositoryPort {
  listar(): Promise<Producto[]>;
  crear(data: NuevoProducto): Promise<Producto>;
}
