import { FormEvent, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth, estaAutenticado } from '../../application/auth/useAuth';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, cargando } = useAuth();
  const navigate = useNavigate();

  if (estaAutenticado()) {
    return <Navigate to="/inicio" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const ok = await login({ username, password });
    if (ok) {
      navigate('/inicio');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(160deg, var(--color-primary), #0f1f36)',
        padding: 16,
      }}
    >
      <div className="card" style={{ width: '100%', maxWidth: 380, padding: 36 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.02em' }}>SAAG Software</div>
          <p style={{ margin: '6px 0 0', color: 'var(--color-text-muted)', fontSize: 14 }}>Ingresa a tu cuenta</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input className="input" placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input
            className="input"
            placeholder="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary" disabled={cargando} style={{ width: '100%', padding: 12 }}>
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
          {error && <p style={{ color: 'var(--color-danger)', fontSize: 13, margin: 0 }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}
