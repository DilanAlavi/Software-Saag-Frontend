import { GrupoPrecioEspecialRepositoryPort } from '../../application/grupo-precio-especial/grupo-precio-especial.port';
import { httpClient } from './httpClient';

export const grupoPrecioEspecialApiRepository: GrupoPrecioEspecialRepositoryPort = {
  async listar() {
    const { data } = await httpClient.get('/grupos-precio-especial');
    return data;
  },
  async crear(dto) {
    const { data } = await httpClient.post('/grupos-precio-especial', dto);
    return data;
  },
  async actualizar(grupoId, dto) {
    const { data } = await httpClient.patch(`/grupos-precio-especial/${grupoId}`, dto);
    return data;
  },
  async agregarProducto(grupoId, productoId) {
    const { data } = await httpClient.post(`/grupos-precio-especial/${grupoId}/productos/${productoId}`);
    return data;
  },
  async quitarProducto(grupoId, productoId) {
    const { data } = await httpClient.delete(`/grupos-precio-especial/${grupoId}/productos/${productoId}`);
    return data;
  },
  async agregarCliente(grupoId, clienteId) {
    const { data } = await httpClient.post(`/grupos-precio-especial/${grupoId}/clientes/${clienteId}`);
    return data;
  },
  async quitarCliente(grupoId, clienteId) {
    const { data } = await httpClient.delete(`/grupos-precio-especial/${grupoId}/clientes/${clienteId}`);
    return data;
  },
  async cambiarEstado(grupoId, estado) {
    const { data } = await httpClient.patch(`/grupos-precio-especial/${grupoId}/estado`, { estado });
    return data;
  },
};
