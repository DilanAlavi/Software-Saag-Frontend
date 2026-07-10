export interface ProductoResumen {
  id: number;
  nombre: string;
}

export interface ClienteResumen {
  id: number;
  nombre: string;
  apellidoPaterno: string;
}

export interface GrupoPrecioEspecial {
  id: number;
  nombre: string;
  categoriaAsignada: string;
  estado: boolean;
  productos: ProductoResumen[];
  clientes: ClienteResumen[];
}
