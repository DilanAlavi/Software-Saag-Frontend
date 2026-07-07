import { ProductoRepositoryPort } from '../../application/producto/producto.port';
import { httpClient } from './httpClient';

export const productoApiRepository: ProductoRepositoryPort = {
  async listar() {
    const { data } = await httpClient.get('/productos');
    return data;
  },
  async crear(nuevoProducto) {
    const { data } = await httpClient.post('/productos', nuevoProducto);
    return data;
  },
};
