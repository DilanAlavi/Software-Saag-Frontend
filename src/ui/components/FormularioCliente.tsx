import { FormEvent, useState } from 'react';
import { Cliente, ETIQUETAS_ROL_CLIENTE } from '../../domain/cliente/cliente.entity';
import { GrupoPrecioEspecial } from '../../domain/grupo-precio-especial/grupo-precio-especial.entity';
import './modal.css';

export interface DatosCliente {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  ci?: string;
  celular: string;
  genero?: string;
  rol: string;
  grupoIds: number[];
}

interface Props {
  clienteInicial?: Cliente;
  gruposDisponibles: GrupoPrecioEspecial[];
  onCancelar: () => void;
  onGuardar: (dto: DatosCliente) => Promise<void>;
}

export function FormularioCliente({ clienteInicial, gruposDisponibles, onCancelar, onGuardar }: Props) {
  const esEdicion = Boolean(clienteInicial);
  const [nombre, setNombre] = useState(clienteInicial?.nombre ?? '');
  const [apellidoPaterno, setApellidoPaterno] = useState(clienteInicial?.apellidoPaterno ?? '');
  const [apellidoMaterno, setApellidoMaterno] = useState(clienteInicial?.apellidoMaterno ?? '');
  const [ci, setCi] = useState(clienteInicial?.ci ?? '');
  const [celular, setCelular] = useState(clienteInicial?.celular ?? '');
  const [genero, setGenero] = useState(clienteInicial?.genero ?? '');
  const [rol, setRol] = useState<string>(clienteInicial?.rol ?? 'STANDARD_1');
  const [gruposSeleccionados, setGruposSeleccionados] = useState<{ id: number; nombre: string }[]>(
    clienteInicial?.grupos.map((g) => ({ id: g.id, nombre: g.nombre })) ?? [],
  );
  const [buscarGrupo, setBuscarGrupo] = useState('');
  const [enviando, setEnviando] = useState(false);

  const resultadosGrupo = gruposDisponibles.filter(
    (g) =>
      g.estado &&
      !gruposSeleccionados.some((s) => s.id === g.id) &&
      g.nombre.toLowerCase().includes(buscarGrupo.toLowerCase()),
  );

  const agregarGrupo = (grupo: GrupoPrecioEspecial) => {
    setGruposSeleccionados((actual) => [...actual, { id: grupo.id, nombre: grupo.nombre }]);
    setBuscarGrupo('');
  };

  const quitarGrupo = (id: number) => {
    setGruposSeleccionados((actual) => actual.filter((g) => g.id !== id));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await onGuardar({
        nombre,
        apellidoPaterno,
        apellidoMaterno: apellidoMaterno || undefined,
        ci: ci || undefined,
        celular,
        genero: genero || undefined,
        rol,
        grupoIds: gruposSeleccionados.map((g) => g.id),
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="saag-modal-overlay">
      <form onSubmit={handleSubmit} className="saag-modal-caja">
        <h3 style={{ marginTop: 0 }}>{esEdicion ? 'Editar cliente' : 'Agregar nuevo cliente'}</h3>

        <input className="saag-input-full" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
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
        <input className="saag-input-full" placeholder="CI (opcional)" value={ci} onChange={(e) => setCi(e.target.value)} />
        <input className="saag-input-full" placeholder="Celular" value={celular} onChange={(e) => setCelular(e.target.value)} required />
        <select className="saag-input-full" value={genero} onChange={(e) => setGenero(e.target.value)}>
          <option value="">Género (opcional)</option>
          <option value="MASCULINO">Masculino</option>
          <option value="FEMENINO">Femenino</option>
          <option value="OTRO">Otro</option>
        </select>

        <select className="saag-input-full" value={rol} onChange={(e) => setRol(e.target.value)}>
          {Object.entries(ETIQUETAS_ROL_CLIENTE).map(([valor, etiqueta]) => (
            <option key={valor} value={valor}>
              {etiqueta}
            </option>
          ))}
        </select>

        <div>
          <label style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'block', marginBottom: 4 }}>
            Roles especiales (opcional — precios especiales para productos puntuales)
          </label>

          {gruposSeleccionados.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
              {gruposSeleccionados.map((g) => (
                <span key={g.id} className="badge badge-neutral" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {g.nombre}
                  <button
                    type="button"
                    onClick={() => quitarGrupo(g.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-danger)', fontWeight: 700 }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <input
            className="saag-input-full"
            placeholder="Buscar rol especial (ej. Cintas)..."
            value={buscarGrupo}
            onChange={(e) => setBuscarGrupo(e.target.value)}
          />
          {buscarGrupo && (
            <div style={{ border: '1px solid var(--color-border)', borderRadius: 8, marginTop: 6, maxHeight: 140, overflowY: 'auto' }}>
              {resultadosGrupo.length === 0 ? (
                <p style={{ padding: 8, margin: 0, fontSize: 13 }}>Sin resultados.</p>
              ) : (
                resultadosGrupo.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => agregarGrupo(g)}
                    style={{ padding: 8, cursor: 'pointer', borderBottom: '1px solid var(--color-border)', fontSize: 14 }}
                  >
                    {g.nombre}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="saag-modal-acciones">
          <button type="button" onClick={onCancelar} className="btn btn-secondary">
            Cancelar
          </button>
          <button type="submit" disabled={enviando} className="btn btn-primary">
            {enviando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Aceptar'}
          </button>
        </div>
      </form>
    </div>
  );
}
