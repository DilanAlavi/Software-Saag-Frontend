import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { UsuarioAutenticado } from '../../domain/auth/auth.entity';
import { cerrarSesion } from '../../application/auth/useAuth';

interface Props {
  usuario: UsuarioAutenticado | null;
  abierto: boolean;
}

export function Sidebar({ usuario, abierto }: Props) {
  const [catalogoAbierto, setCatalogoAbierto] = useState(true);
  const [panelAbierto, setPanelAbierto] = useState(true);
  const tieneAccesoPanel = usuario?.rol === 'ADMIN' || usuario?.rol === 'ADMIN_SUCURSAL';
  const navigate = useNavigate();

  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate('/');
  };

  return (
    <aside className={`saag-sidebar ${abierto ? 'abierto' : ''}`}>
      <div className="saag-sidebar-contenido">
        <div className="saag-sidebar-brand">SAAG Software</div>

        <button className="saag-menu-item" onClick={() => setCatalogoAbierto((v) => !v)}>
          Catálogo
          <span>{catalogoAbierto ? '▾' : '▸'}</span>
        </button>
        {catalogoAbierto && (
          <nav className="saag-submenu">
            <NavLink to="/panel/productos" className={({ isActive }) => (isActive ? 'activo' : '')}>
              Productos
            </NavLink>
            {tieneAccesoPanel && (
              <>
                <NavLink to="/panel/precios" className={({ isActive }) => (isActive ? 'activo' : '')}>
                  Precios
                </NavLink>
                <NavLink to="/panel/marcas" className={({ isActive }) => (isActive ? 'activo' : '')}>
                  Marcas
                </NavLink>
              </>
            )}
          </nav>
        )}

        {tieneAccesoPanel && (
          <>
            <button className="saag-menu-item" onClick={() => setPanelAbierto((v) => !v)}>
              Panel
              <span>{panelAbierto ? '▾' : '▸'}</span>
            </button>
            {panelAbierto && (
              <nav className="saag-submenu">
                <NavLink to="/panel/usuarios" className={({ isActive }) => (isActive ? 'activo' : '')}>
                  Usuarios
                </NavLink>
                <NavLink to="/panel/clientes" className={({ isActive }) => (isActive ? 'activo' : '')}>
                  Clientes
                </NavLink>
              </nav>
            )}
          </>
        )}
      </div>

      <button className="saag-menu-item saag-cerrar-sesion" onClick={handleCerrarSesion}>
        Cerrar sesión
      </button>
    </aside>
  );
}
