import { PrecioRepositoryPort } from '../../application/precio/precio.port';
import { httpClient } from './httpClient';

export const precioApiRepository: PrecioRepositoryPort = {
  async listar() {
    const { data } = await httpClient.get('/precios');
    return data;
  },
  async guardar(productoId, dto) {
    await httpClient.put(`/precios/${productoId}`, dto);
  },
};
