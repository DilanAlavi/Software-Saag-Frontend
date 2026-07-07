import { ClienteRepositoryPort } from '../../application/cliente/cliente.port';
import { httpClient } from './httpClient';

export const clienteApiRepository: ClienteRepositoryPort = {
  async listar(filtros) {
    const { data } = await httpClient.get('/clientes', { params: filtros });
    return data;
  },
  async cambiarEstado(id, estado) {
    const { data } = await httpClient.patch(`/clientes/${id}/estado`, { estado });
    return data;
  },
};
