import { ProductoConPrecio } from '../../domain/precio/precio.entity';

export interface GuardarPrecioInput {
  precioCosto: number;
  menor1: number;
  menor2: number;
  mayor1: number;
  mayor2: number;
  plomeria: number;
  carpinteria: number;
  electricista: number;
  precioCaja?: number;
  cantidadMinimaDescuentoMenor1?: number;
  precioDescuentoMenor1?: number;
}

export interface PrecioRepositoryPort {
  listar(): Promise<ProductoConPrecio[]>;
  guardar(productoId: number, dto: GuardarPrecioInput): Promise<void>;
}
