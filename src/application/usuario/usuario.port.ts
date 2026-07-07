import { Usuario } from '../../domain/usuario/usuario.entity';

export interface UsuarioFiltros {
  search?: string;
  sucursalId?: number;
}

export interface UsuarioRepositoryPort {
  listar(filtros: UsuarioFiltros): Promise<Usuario[]>;
  cambiarEstado(id: number, estado: boolean): Promise<Usuario>;
  crear(dto: any): Promise<{ usuario: Usuario; credenciales: { username: string; password: string } }>;
}
