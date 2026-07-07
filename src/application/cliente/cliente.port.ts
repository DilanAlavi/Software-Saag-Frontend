import { Cliente } from '../../domain/cliente/cliente.entity';

export interface ClienteFiltros {
  search?: string;
  rol?: string;
}

export interface ClienteRepositoryPort {
  listar(filtros: ClienteFiltros): Promise<Cliente[]>;
  cambiarEstado(id: number, estado: boolean): Promise<Cliente>;
}
