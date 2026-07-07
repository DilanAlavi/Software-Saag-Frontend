import { Sucursal } from '../../domain/sucursal/sucursal.entity';

export interface SucursalRepositoryPort {
  listar(): Promise<Sucursal[]>;
}
