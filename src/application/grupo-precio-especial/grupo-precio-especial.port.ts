import { GrupoPrecioEspecial } from '../../domain/grupo-precio-especial/grupo-precio-especial.entity';

export interface CrearGrupoInput {
  nombre: string;
  categoriaAsignada: string;
}

export interface ActualizarGrupoInput {
  nombre?: string;
  categoriaAsignada?: string;
}

export interface GrupoPrecioEspecialRepositoryPort {
  listar(): Promise<GrupoPrecioEspecial[]>;
  crear(dto: CrearGrupoInput): Promise<GrupoPrecioEspecial>;
  actualizar(grupoId: number, dto: ActualizarGrupoInput): Promise<GrupoPrecioEspecial>;
  agregarProducto(grupoId: number, productoId: number): Promise<GrupoPrecioEspecial>;
  quitarProducto(grupoId: number, productoId: number): Promise<GrupoPrecioEspecial>;
  agregarCliente(grupoId: number, clienteId: number): Promise<GrupoPrecioEspecial>;
  quitarCliente(grupoId: number, clienteId: number): Promise<GrupoPrecioEspecial>;
  cambiarEstado(grupoId: number, estado: boolean): Promise<GrupoPrecioEspecial>;
}
