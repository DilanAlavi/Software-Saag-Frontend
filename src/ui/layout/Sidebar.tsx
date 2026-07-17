import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { UsuarioAutenticado } from '../../domain/auth/auth.entity';
import { cerrarSesion } from '../../application/auth/useAuth';

interface Props {
  usuario: UsuarioAutenticado | null;
  abierto: boolean;
  onCerrar: () => void;
}

type Grupo = 'administracion' | 'ventas' | 'ganancias' | 'productos' | 'inventario' | null;

export function Sidebar({ usuario, abierto, onCerrar }: Props) {
  const [grupoAbierto, setGrupoAbierto] = useState<Grupo>('ventas');
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

        {tieneAccesoPanel && (
          <>
            <button className="saag-menu-item" onClick={() => alternar('administracion')}>
              Administración
              <span>{grupoAbierto === 'administracion' ? '▾' : '▸'}</span>
            </button>
            {grupoAbierto === 'administracion' && (
              <nav className="saag-submenu" onClick={onCerrar}>
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

        <button className="saag-menu-item" onClick={() => alternar('ventas')}>
          Ventas
          <span>{grupoAbierto === 'ventas' ? '▾' : '▸'}</span>
        </button>
        {grupoAbierto === 'ventas' && (
          <nav className="saag-submenu" onClick={onCerrar}>
            <NavLink to="/panel/ventas/dia" className={({ isActive }) => (isActive ? 'activo' : '')}>
              Ventas del día
            </NavLink>
            <NavLink to="/panel/ventas" end className={({ isActive }) => (isActive ? 'activo' : '')}>
              Historial de ventas
            </NavLink>
            <NavLink to="/panel/ventas/nueva" className={({ isActive }) => (isActive ? 'activo' : '')}>
              Nueva venta
            </NavLink>
            <NavLink to="/panel/cuentas-por-cobrar" className={({ isActive }) => (isActive ? 'activo' : '')}>
              Cuentas por cobrar
            </NavLink>
          </nav>
        )}

        {tieneAccesoPanel && (
          <>
            <button className="saag-menu-item" onClick={() => alternar('ganancias')}>
              Ganancias
              <span>{grupoAbierto === 'ganancias' ? '▾' : '▸'}</span>
            </button>
            {grupoAbierto === 'ganancias' && (
              <nav className="saag-submenu" onClick={onCerrar}>
                <NavLink to="/panel/ganancias/dia" className={({ isActive }) => (isActive ? 'activo' : '')}>
                  Ganancias del día
                </NavLink>
                <NavLink to="/panel/ganancias" end className={({ isActive }) => (isActive ? 'activo' : '')}>
                  Historial de Ganancias
                </NavLink>
              </nav>
            )}
          </>
        )}

        <button className="saag-menu-item" onClick={() => alternar('productos')}>
          Productos
          <span>{grupoAbierto === 'productos' ? '▾' : '▸'}</span>
        </button>
        {grupoAbierto === 'productos' && (
          <nav className="saag-submenu" onClick={onCerrar}>
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
                <NavLink to="/panel/grupos-precio-especial" className={({ isActive }) => (isActive ? 'activo' : '')}>
                  Grupos de Precio Especial
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
          <nav className="saag-submenu" onClick={onCerrar}>
            <NavLink to="/panel/stock" className={({ isActive }) => (isActive ? 'activo' : '')}>
              Stock
            </NavLink>
            {tieneAccesoPanel && (
              <NavLink to="/panel/sucursales" className={({ isActive }) => (isActive ? 'activo' : '')}>
                Sucursales
              </NavLink>
            )}
          </nav>
        )}
      </div>

      <button className="saag-menu-item saag-cerrar-sesion" onClick={handleCerrarSesion}>
        Cerrar sesión
      </button>
    </aside>
  );
}
