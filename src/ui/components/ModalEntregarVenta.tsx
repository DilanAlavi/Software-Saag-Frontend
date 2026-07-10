import { useState } from 'react';
import { Venta } from '../../domain/venta/venta.entity';
import './modal.css';

interface Props {
  venta: Venta;
  onCancelar: () => void;
  onConfirmar: (detalleIds: number[]) => Promise<void>;
}

export function ModalEntregarVenta({ venta, onCancelar, onConfirmar }: Props) {
  const yaCompleto = venta.detalles.every((d) => d.entregado);
  const [seleccionados, setSeleccionados] = useState<number[]>(venta.detalles.filter((d) => d.entregado).map((d) => d.id));
  const [enviando, setEnviando] = useState(false);

  const alternar = (id: number) => {
    setSeleccionados((actual) => (actual.includes(id) ? actual.filter((x) => x !== id) : [...actual, id]));
  };

  const handleConfirmar = async () => {
    setEnviando(true);
    try {
      await onConfirmar(seleccionados);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="saag-modal-overlay" onClick={onCancelar}>
      <div className="saag-modal-caja" onClick={(e) => e.stopPropagation()}>
        <h3>Entrega — Venta #{venta.id}</h3>

        {yaCompleto ? (
          <>
            <div
              style={{
                background: 'var(--color-success-soft)',
                color: 'var(--color-success)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              Todo listo — entregado.
            </div>
            {venta.detalles.map((d) => (
              <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 14 }}>
                <span>
                  {d.nombreProducto} x {d.cantidad}
                </span>
                <span className="badge badge-success">Entregado</span>
              </div>
            ))}
          </>
        ) : (
          <>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-muted)' }}>
              Marca los productos que el cliente ya se llevó.
            </p>
            {venta.detalles.map((d) => (
              <label key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', fontSize: 14 }}>
                <input type="checkbox" checked={seleccionados.includes(d.id)} onChange={() => alternar(d.id)} />
                {d.nombreProducto} x {d.cantidad}
              </label>
            ))}
          </>
        )}

        <div className="saag-modal-acciones">
          <button type="button" className="btn btn-secondary" onClick={onCancelar}>
            {yaCompleto ? 'Cerrar' : 'Cancelar'}
          </button>
          {!yaCompleto && (
            <button type="button" className="btn btn-primary" disabled={enviando} onClick={handleConfirmar}>
              {enviando ? 'Guardando...' : 'Guardar entrega'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
