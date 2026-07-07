import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { UsuarioAutenticado } from '../../domain/auth/auth.entity';

interface Props {
  usuario: UsuarioAutenticado | null;
  abierto: boolean;
}

export function Sidebar({ usuario, abierto }: Props) {
  const [panelAbierto, setPanelAbierto] = useState(true);
  const tieneAccesoPanel = usuario?.rol === 'ADMIN' || usuario?.rol === 'ADMIN_SUCURSAL';

  return (
    <aside className={`saag-sidebar ${abierto ? 'abierto' : ''}`}>
      <div className="saag-sidebar-brand">SAAG Software</div>

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
    </aside>
  );
}
