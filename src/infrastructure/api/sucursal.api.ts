import { SucursalRepositoryPort } from '../../application/sucursal/sucursal.port';
import { httpClient } from './httpClient';

export const sucursalApiRepository: SucursalRepositoryPort = {
  async listar() {
    const { data } = await httpClient.get('/sucursales');
    return data;
  },
  async crear(dto) {
    const { data } = await httpClient.post('/sucursales', dto);
    return data;
  },
  async actualizar(id, dto) {
    const { data } = await httpClient.patch(`/sucursales/${id}`, dto);
    return data;
  },
  async cambiarEstado(id, estado) {
    const { data } = await httpClient.patch(`/sucursales/${id}/estado`, { estado });
    return data;
  },
};
