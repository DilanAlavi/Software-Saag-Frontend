import { Navigate, Outlet } from 'react-router-dom';
import { estaAutenticado } from '../application/auth/useAuth';

export function RutaPrivada() {
  return estaAutenticado() ? <Outlet /> : <Navigate to="/" replace />;
}
