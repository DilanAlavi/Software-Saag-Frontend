import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { obtenerUsuarioActual } from '../../application/auth/useAuth';
import { CampanaDeudas } from '../components/CampanaDeudas';
import './sidebar.css';

export function AppLayout() {
  const [abierto, setAbierto] = useState(false);
  const usuario = obtenerUsuarioActual();

  return (
    <div className="saag-layout">
      <div className="saag-topbar">
        <span>SAAG Software</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <CampanaDeudas />
          <button onClick={() => setAbierto((v) => !v)} aria-label="Abrir menú">
            ☰
          </button>
        </div>
      </div>
      <Sidebar usuario={usuario} abierto={abierto} onCerrar={() => setAbierto(false)} />
      <main className="saag-contenido">
        <Outlet />
      </main>
    </div>
  );
}
