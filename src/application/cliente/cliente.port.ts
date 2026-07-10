import { Cliente } from '../../domain/cliente/cliente.entity';

export interface ClienteFiltros {
  search?: string;
  rol?: string;
}

export interface CrearClienteInput {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  ci?: string;
  celular: string;
  genero?: string;
  rol: string;
}

export interface ActualizarClienteInput {
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  ci?: string;
  celular?: string;
  genero?: string;
  rol?: string;
}

export interface ClienteRepositoryPort {
  listar(filtros: ClienteFiltros): Promise<Cliente[]>;
  obtener(id: number): Promise<Cliente>;
  crear(dto: CrearClienteInput): Promise<Cliente>;
  actualizar(id: number, dto: ActualizarClienteInput): Promise<Cliente>;
  cambiarEstado(id: number, estado: boolean): Promise<Cliente>;
}
