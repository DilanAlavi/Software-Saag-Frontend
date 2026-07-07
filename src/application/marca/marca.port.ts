import { Marca } from '../../domain/marca/marca.entity';

export interface MarcaRepositoryPort {
  listar(): Promise<Marca[]>;
  crear(nombre: string): Promise<Marca>;
  eliminar(id: number): Promise<Marca>;
}
