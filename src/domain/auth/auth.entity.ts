export interface Credenciales {
  username: string;
  password: string;
}

export interface UsuarioAutenticado {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  rol: 'ADMIN' | 'ADMIN_SUCURSAL' | 'VENDEDOR';
  sucursalId: number | null;
}

export interface SesionAuth {
  access_token: string;
  usuario: UsuarioAutenticado;
}
