import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { UsuarioAutenticado } from '../../domain/auth/auth.entity';
import { cerrarSesion } from '../../application/auth/useAuth';

interface Props {
  usuario: UsuarioAutenticado | null;
  abierto: boolean;
}

type Grupo = 'catalogo' | 'inventario' | 'panel' | null;

export function Sidebar({ usuario, abierto }: Props) {
  const [grupoAbierto, setGrupoAbierto] = useState<Grupo>('catalogo');
  const tieneAccesoPanel = usuario?.rol === 'ADMIN' || usuario?.rol === 'ADMIN_SUCURSAL';
  const navigate = useNavigate();

  const alternar = (grupo: Grupo) => {
    setGrupoAbierto((actual) => (actual === grupo ? null : grupo));
  };

  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate('/');
  };

  return (
    <aside className={`saag-sidebar ${abierto ? 'abierto' : ''}`}>
      <div className="saag-sidebar-contenido">
        <div className="saag-sidebar-brand">SAAG Software</div>

        <button className="saag-menu-item" onClick={() => alternar('catalogo')}>
          Catálogo
          <span>{grupoAbierto === 'catalogo' ? '▾' : '▸'}</span>
        </button>
        {grupoAbierto === 'catalogo' && (
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

        <button className="saag-menu-item" onClick={() => alternar('inventario')}>
          Inventario
          <span>{grupoAbierto === 'inventario' ? '▾' : '▸'}</span>
        </button>
        {grupoAbierto === 'inventario' && (
          <nav className="saag-submenu">
            <NavLink to="/panel/stock" className={({ isActive }) => (isActive ? 'activo' : '')}>
              Stock
            </NavLink>
          </nav>
        )}

        {tieneAccesoPanel && (
          <>
            <button className="saag-menu-item" onClick={() => alternar('panel')}>
              Panel
              <span>{grupoAbierto === 'panel' ? '▾' : '▸'}</span>
            </button>
            {grupoAbierto === 'panel' && (
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
