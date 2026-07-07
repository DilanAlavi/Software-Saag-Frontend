import { SucursalRepositoryPort } from '../../application/sucursal/sucursal.port';
import { httpClient } from './httpClient';

export const sucursalApiRepository: SucursalRepositoryPort = {
  async listar() {
    const { data } = await httpClient.get('/sucursales');
    return data;
  },
};
