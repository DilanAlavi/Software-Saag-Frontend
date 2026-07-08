export interface Precio {
  id: number;
  productoId: number;
  precioCosto: number;
  menor1: number;
  menor2: number;
  mayor1: number;
  mayor2: number;
  plomeria: number;
  carpinteria: number;
  electricista: number;
  precioCaja: number | null;
  cantidadMinimaDescuentoMenor1: number | null;
  precioDescuentoMenor1: number | null;
}

export interface ProductoConPrecio {
  productoId: number;
  nombre: string;
  tipoProducto: string;
  precio: Precio | null;
}
