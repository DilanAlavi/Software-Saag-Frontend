import { FormEvent, useState } from 'react';
import { Sucursal } from '../../domain/sucursal/sucursal.entity';
import { UsuarioAutenticado } from '../../domain/auth/auth.entity';
import './modal.css';

interface Props {
  usuarioActual: UsuarioAutenticado | null;
  sucursales: Sucursal[];
  onCancelar: () => void;
  onCrear: (dto: any) => Promise<void>;
}

export function FormularioUsuario({ usuarioActual, sucursales, onCancelar, onCrear }: Props) {
  const esAdmin = usuarioActual?.rol === 'ADMIN';

  const [nombre, setNombre] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [ci, setCi] = useState('');
  const [celular, setCelular] = useState('');
  const [genero, setGenero] = useState('');
  const [rol, setRol] = useState('VENDEDOR');
  const [sucursalId, setSucursalId] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await onCrear({
        nombre,
        apellidoPaterno,
        apellidoMaterno: apellidoMaterno || undefined,
        ci: ci || undefined,
        celular,
        genero: genero || undefined,
        rol: esAdmin ? rol : undefined,
        sucursalId: esAdmin && sucursalId ? Number(sucursalId) : undefined,
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="saag-modal-overlay">
      <form onSubmit={handleSubmit} className="saag-modal-caja">
        <h3 style={{ marginTop: 0 }}>Agregar nuevo usuario</h3>

        <input
          className="saag-input-full"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          className="saag-input-full"
          placeholder="Apellido paterno"
          value={apellidoPaterno}
          onChange={(e) => setApellidoPaterno(e.target.value)}
          required
        />
        <input
          className="saag-input-full"
          placeholder="Apellido materno (opcional)"
          value={apellidoMaterno}
          onChange={(e) => setApellidoMaterno(e.target.value)}
        />
        <input
          className="saag-input-full"
          placeholder="CI (opcional)"
          value={ci}
          onChange={(e) => setCi(e.target.value)}
        />
        <input
          className="saag-input-full"
          placeholder="Celular"
          value={celular}
          onChange={(e) => setCelular(e.target.value)}
          required
        />
        <select className="saag-input-full" value={genero} onChange={(e) => setGenero(e.target.value)}>
          <option value="">Género (opcional)</option>
          <option value="MASCULINO">Masculino</option>
          <option value="FEMENINO">Femenino</option>
          <option value="OTRO">Otro</option>
        </select>

        {esAdmin && (
          <>
            <select className="saag-input-full" value={rol} onChange={(e) => setRol(e.target.value)}>
              <option value="ADMIN">Admin</option>
              <option value="ADMIN_SUCURSAL">Admin Sucursal</option>
              <option value="VENDEDOR">Vendedor</option>
            </select>
            <select className="saag-input-full" value={sucursalId} onChange={(e) => setSucursalId(e.target.value)}>
              <option value="">Sucursal (opcional)</option>
              {sucursales.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </>
        )}

        <div className="saag-modal-acciones">
          <button type="button" onClick={onCancelar} style={botonSecundario}>
            Cancelar
          </button>
          <button type="submit" disabled={enviando} style={botonPrimario}>
            {enviando ? 'Creando...' : 'Aceptar'}
          </button>
        </div>
      </form>
    </div>
  );
}

const botonPrimario = {
  background: '#1a1a1a',
  color: '#faf6ef',
  border: 'none',
  padding: '8px 16px',
  borderRadius: 6,
  cursor: 'pointer',
} as const;

const botonSecundario = {
  background: 'transparent',
  color: '#1a1a1a',
  border: '1px solid #1a1a1a',
  padding: '8px 16px',
  borderRadius: 6,
  cursor: 'pointer',
} as const;
