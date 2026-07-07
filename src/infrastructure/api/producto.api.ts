import { ProductoRepositoryPort } from '../../application/producto/producto.port';
import { httpClient } from './httpClient';

export const productoApiRepository: ProductoRepositoryPort = {
  async listar(filtros) {
    const { data } = await httpClient.get('/productos', { params: filtros });
    return data;
  },
  async crear(dto) {
    const { data } = await httpClient.post('/productos', dto);
    return data;
  },
  async eliminar(id) {
    const { data } = await httpClient.delete(`/productos/${id}`);
    return data;
  },
};
