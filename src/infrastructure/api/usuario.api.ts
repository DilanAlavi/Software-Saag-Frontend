import { UsuarioRepositoryPort } from '../../application/usuario/usuario.port';
import { httpClient } from './httpClient';

export const usuarioApiRepository: UsuarioRepositoryPort = {
  async listar(filtros) {
    const { data } = await httpClient.get('/usuarios', { params: filtros });
    return data;
  },
  async cambiarEstado(id, estado) {
    const { data } = await httpClient.patch(`/usuarios/${id}/estado`, { estado });
    return data;
  },
  async crear(dto) {
    const { data } = await httpClient.post('/usuarios', dto);
    return data;
  },
};
