import { useState } from 'react';
import { Venta } from '../../domain/venta/venta.entity';
import './modal.css';

interface Props {
  venta: Venta;
  onCancelar: () => void;
  onConfirmar: (mensaje: string) => Promise<void>;
}

export function ModalReportarVenta({ venta, onCancelar, onConfirmar }: Props) {
  const [mensaje, setMensaje] = useState(venta.reporte ?? '');
  const [enviando, setEnviando] = useState(false);

  const handleConfirmar = async () => {
    setEnviando(true);
    try {
      await onConfirmar(mensaje.trim());
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="saag-modal-overlay" onClick={onCancelar}>
      <div className="saag-modal-caja" onClick={(e) => e.stopPropagation()}>
        <h3>Reporte — Venta #{venta.id}</h3>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-muted)' }}>
          Anota algo importante para hacerle seguimiento a esta venta (un problema, un pedido especial del cliente, etc.).
        </p>
        {venta.fechaReporte && (
          <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)' }}>
            Último reporte: {new Date(venta.fechaReporte).toLocaleString()}
          </p>
        )}
        <textarea
          className="saag-input-full"
          rows={4}
          placeholder="Escribe qué pasó..."
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          style={{ resize: 'vertical', fontFamily: 'inherit' }}
        />
        <div className="saag-modal-acciones">
          <button type="button" className="btn btn-secondary" onClick={onCancelar}>
            Cancelar
          </button>
          <button type="button" className="btn btn-primary" disabled={enviando || mensaje.trim().length < 3} onClick={handleConfirmar}>
            {enviando ? 'Guardando...' : 'Guardar reporte'}
          </button>
        </div>
      </div>
    </div>
  );
}
