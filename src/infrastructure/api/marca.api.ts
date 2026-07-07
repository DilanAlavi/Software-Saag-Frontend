import { MarcaRepositoryPort } from '../../application/marca/marca.port';
import { httpClient } from './httpClient';

export const marcaApiRepository: MarcaRepositoryPort = {
  async listar() {
    const { data } = await httpClient.get('/marcas');
    return data;
  },
  async crear(nombre) {
    const { data } = await httpClient.post('/marcas', { nombre });
    return data;
  },
  async eliminar(id) {
    const { data } = await httpClient.delete(`/marcas/${id}`);
    return data;
  },
};
