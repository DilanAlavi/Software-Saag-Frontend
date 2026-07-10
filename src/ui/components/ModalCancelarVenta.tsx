import { useState } from 'react';
import { Venta, ETIQUETAS_MOTIVO_CANCELACION, MotivoCancelacion } from '../../domain/venta/venta.entity';
import './modal.css';

interface Props {
  venta: Venta;
  onCancelar: () => void;
  onConfirmar: (motivo: MotivoCancelacion) => Promise<void>;
}

export function ModalCancelarVenta({ venta, onCancelar, onConfirmar }: Props) {
  const [motivo, setMotivo] = useState<MotivoCancelacion>('NO_RECOGIO');
  const [enviando, setEnviando] = useState(false);

  const handleConfirmar = async () => {
    setEnviando(true);
    try {
      await onConfirmar(motivo);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="saag-modal-overlay" onClick={onCancelar}>
      <div className="saag-modal-caja" onClick={(e) => e.stopPropagation()}>
        <h3>Reportar cancelación — Venta #{venta.id}</h3>
        <select className="saag-input-full" value={motivo} onChange={(e) => setMotivo(e.target.value as MotivoCancelacion)}>
          {Object.entries(ETIQUETAS_MOTIVO_CANCELACION).map(([valor, etiqueta]) => (
            <option key={valor} value={valor}>
              {etiqueta}
            </option>
          ))}
        </select>
        <div className="saag-modal-acciones">
          <button type="button" onClick={onCancelar} className="btn btn-secondary">
            Volver
          </button>
          <button type="button" disabled={enviando} onClick={handleConfirmar} className="btn btn-danger-solid">
            {enviando ? 'Guardando...' : 'Confirmar cancelación'}
          </button>
        </div>
      </div>
    </div>
  );
}
