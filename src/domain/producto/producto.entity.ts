export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
}

export type NuevoProducto = Omit<Producto, 'id'>;
