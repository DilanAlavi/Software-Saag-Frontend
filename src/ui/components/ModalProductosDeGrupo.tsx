import { useState } from 'react';
import { GrupoPrecioEspecial } from '../../domain/grupo-precio-especial/grupo-precio-especial.entity';
import { Producto } from '../../domain/producto/producto.entity';
import './modal.css';

interface Props {
  grupo: GrupoPrecioEspecial;
  productosDisponibles: Producto[];
  onAgregar: (productoId: number) => Promise<void>;
  onQuitar: (productoId: number) => Promise<void>;
  onCerrar: () => void;
}

export function ModalProductosDeGrupo({ grupo, productosDisponibles, onAgregar, onQuitar, onCerrar }: Props) {
  const [buscar, setBuscar] = useState('');

  const resultados = productosDisponibles.filter(
    (p) => !grupo.productos.some((gp) => gp.id === p.id) && p.nombre.toLowerCase().includes(buscar.toLowerCase()),
  );

  return (
    <div className="saag-modal-overlay" onClick={onCerrar}>
      <div className="saag-modal-caja" onClick={(e) => e.stopPropagation()}>
        <h3>Productos — {grupo.nombre}</h3>

        {grupo.productos.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: 0 }}>Sin productos todavía.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {grupo.productos.map((p) => (
              <li key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 14 }}>
                {p.nombre}
                <button
                  onClick={() => onQuitar(p.id)}
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
          placeholder="Buscar producto para agregar..."
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
        />
        {buscar && (
          <div style={{ border: '1px solid var(--color-border)', borderRadius: 8, maxHeight: 160, overflowY: 'auto' }}>
            {resultados.length === 0 ? (
              <p style={{ padding: 8, margin: 0, fontSize: 13 }}>Sin resultados.</p>
            ) : (
              resultados.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    onAgregar(p.id);
                    setBuscar('');
                  }}
                  style={{ padding: 8, cursor: 'pointer', borderBottom: '1px solid var(--color-border)', fontSize: 14 }}
                >
                  {p.nombre}
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
