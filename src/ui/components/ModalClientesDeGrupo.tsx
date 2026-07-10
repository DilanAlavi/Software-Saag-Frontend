import { useState } from 'react';
import { GrupoPrecioEspecial } from '../../domain/grupo-precio-especial/grupo-precio-especial.entity';
import { Cliente } from '../../domain/cliente/cliente.entity';
import './modal.css';

interface Props {
  grupo: GrupoPrecioEspecial;
  clientesDisponibles: Cliente[];
  onAgregar: (clienteId: number) => Promise<void>;
  onQuitar: (clienteId: number) => Promise<void>;
  onCerrar: () => void;
}

export function ModalClientesDeGrupo({ grupo, clientesDisponibles, onAgregar, onQuitar, onCerrar }: Props) {
  const [buscar, setBuscar] = useState('');

  const resultados = clientesDisponibles.filter(
    (c) =>
      !grupo.clientes.some((gc) => gc.id === c.id) &&
      `${c.nombre} ${c.apellidoPaterno}`.toLowerCase().includes(buscar.toLowerCase()),
  );

  return (
    <div className="saag-modal-overlay" onClick={onCerrar}>
      <div className="saag-modal-caja" onClick={(e) => e.stopPropagation()}>
        <h3>Clientes — {grupo.nombre}</h3>

        {grupo.clientes.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: 0 }}>Sin clientes todavía.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {grupo.clientes.map((c) => (
              <li key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 14 }}>
                {c.nombre} {c.apellidoPaterno}
                <button
                  onClick={() => onQuitar(c.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', fontSize: 13 }}
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        )}

        <input
          className="saag-input-full"
          placeholder="Buscar cliente para agregar..."
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
        />
        {buscar && (
          <div style={{ border: '1px solid var(--color-border)', borderRadius: 8, maxHeight: 160, overflowY: 'auto' }}>
            {resultados.length === 0 ? (
              <p style={{ padding: 8, margin: 0, fontSize: 13 }}>Sin resultados.</p>
            ) : (
              resultados.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    onAgregar(c.id);
                    setBuscar('');
                  }}
                  style={{ padding: 8, cursor: 'pointer', borderBottom: '1px solid var(--color-border)', fontSize: 14 }}
                >
                  {c.nombre} {c.apellidoPaterno}
                </div>
              ))
            )}
          </div>
        )}

        <div className="saag-modal-acciones">
          <button type="button" className="btn btn-secondary" onClick={onCerrar}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
