import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { obtenerUsuarioActual } from '../../application/auth/useAuth';
import './sidebar.css';

export function AppLayout() {
  const [abierto, setAbierto] = useState(false);
  const usuario = obtenerUsuarioActual();

  return (
    <div className="saag-layout">
      <div className="saag-topbar">
        <span>SAAG Software</span>
        <button onClick={() => setAbierto((v) => !v)} aria-label="Abrir menú">
          ☰
        </button>
      </div>
      <Sidebar usuario={usuario} abierto={abierto} />
      <main className="saag-contenido">
        <Outlet />
      </main>
    </div>
  );
}
