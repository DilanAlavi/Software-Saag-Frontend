import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LoginPage } from './ui/pages/LoginPage';
import { InicioPage } from './ui/pages/InicioPage';
import { UsuariosPage } from './ui/pages/UsuariosPage';
import { ClientesPage } from './ui/pages/ClientesPage';
import { RutaPrivada } from './ui/RutaPrivada';
import { RutaAdmin } from './ui/RutaAdmin';
import { AppLayout } from './ui/layout/AppLayout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<RutaPrivada />}>
          <Route element={<AppLayout />}>
            <Route path="/inicio" element={<InicioPage />} />
            <Route element={<RutaAdmin />}>
              <Route path="/panel/usuarios" element={<UsuariosPage />} />
              <Route path="/panel/clientes" element={<ClientesPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
