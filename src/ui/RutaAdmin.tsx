import { Navigate, Outlet } from 'react-router-dom';
import { obtenerUsuarioActual } from '../application/auth/useAuth';

export function RutaAdmin() {
  const usuario = obtenerUsuarioActual();
  const permitido = usuario?.rol === 'ADMIN' || usuario?.rol === 'ADMIN_SUCURSAL';
  return permitido ? <Outlet /> : <Navigate to="/inicio" replace />;
}
