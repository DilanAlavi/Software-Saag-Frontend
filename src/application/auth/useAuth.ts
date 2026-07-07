import { useCallback, useState } from 'react';
import { Credenciales, UsuarioAutenticado } from '../../domain/auth/auth.entity';
import { authApiRepository } from '../../infrastructure/api/auth.api';

const TOKEN_KEY = 'saag_token';
const USUARIO_KEY = 'saag_usuario';

export function useAuth() {
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const login = useCallback(async (credenciales: Credenciales) => {
    setCargando(true);
    setError(null);
    try {
      const sesion = await authApiRepository.login(credenciales);
      localStorage.setItem(TOKEN_KEY, sesion.access_token);
      localStorage.setItem(USUARIO_KEY, JSON.stringify(sesion.usuario));
      return true;
    } catch {
      setError('Usuario o contraseña incorrectos');
      return false;
    } finally {
      setCargando(false);
    }
  }, []);

  return { login, error, cargando };
}

export function estaAutenticado() {
  return Boolean(localStorage.getItem(TOKEN_KEY));
}

export function obtenerUsuarioActual(): UsuarioAutenticado | null {
  const raw = localStorage.getItem(USUARIO_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function cerrarSesion() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USUARIO_KEY);
}
