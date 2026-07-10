import { useState } from 'react';
import { Venta } from '../../domain/venta/venta.entity';
import './modal.css';

interface Props {
  venta: Venta;
  onCancelar: () => void;
  onConfirmar: (efectivoRecibido: number) => Promise<void>;
}

export function ModalPagarVenta({ venta, onCancelar, onConfirmar }: Props) {
  const [efectivoRecibido, setEfectivoRecibido] = useState('');
  const [enviando, setEnviando] = useState(false);
  const vuelto = efectivoRecibido !== '' ? Number(efectivoRecibido) - venta.total : null;

  const handleConfirmar = async () => {
    setEnviando(true);
    try {
      await onConfirmar(Number(efectivoRecibido));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="saag-modal-overlay" onClick={onCancelar}>
      <div className="saag-modal-caja" onClick={(e) => e.stopPropagation()}>
        <h3>Registrar pago — Venta #{venta.id}</h3>
        <p style={{ margin: 0, fontSize: 15 }}>
          Total a pagar: <strong>Bs {venta.total.toFixed(2)}</strong>
        </p>
        <input
          className="saag-input-full"
          type="number"
          min={0}
          placeholder="Efectivo recibido"
          value={efectivoRecibido}
          onChange={(e) => setEfectivoRecibido(e.target.value)}
        />
        {vuelto !== null && (
          <p style={{ fontWeight: 700, margin: 0, color: vuelto >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
            {vuelto >= 0 ? `Vuelto: Bs ${vuelto.toFixed(2)}` : `Falta: Bs ${Math.abs(vuelto).toFixed(2)}`}
          </p>
        )}
        <div className="saag-modal-acciones">
          <button type="button" onClick={onCancelar} className="btn btn-secondary">
            Cancelar
          </button>
          <button
            type="button"
            disabled={enviando || efectivoRecibido === '' || Number(efectivoRecibido) < venta.total}
            onClick={handleConfirmar}
            className="btn btn-primary"
          >
            {enviando ? 'Guardando...' : 'Confirmar pago'}
          </button>
        </div>
      </div>
    </div>
  );
}
