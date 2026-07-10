import { Sucursal } from '../../domain/sucursal/sucursal.entity';

export interface CrearSucursalInput {
  nombre: string;
  tipo: string;
  departamento?: string;
  ciudad?: string;
  zona?: string;
  referencia?: string;
  modalidadVentaPaquete?: string;
}

export interface ActualizarSucursalInput {
  nombre?: string;
  tipo?: string;
  departamento?: string;
  ciudad?: string;
  zona?: string;
  referencia?: string;
  modalidadVentaPaquete?: string;
}

export interface SucursalRepositoryPort {
  listar(): Promise<Sucursal[]>;
  crear(dto: CrearSucursalInput): Promise<Sucursal>;
  actualizar(id: number, dto: ActualizarSucursalInput): Promise<Sucursal>;
  cambiarEstado(id: number, estado: boolean): Promise<Sucursal>;
}
