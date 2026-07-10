import { useState } from 'react';
import { StockConDetalle } from '../../domain/stock/stock.entity';
import './modal.css';

interface Props {
  fila: StockConDetalle;
  onCancelar: () => void;
  onConfirmar: (cantidad: number) => Promise<void>;
}

export function FormularioConfirmarStock({ fila, onCancelar, onConfirmar }: Props) {
  const [cantidad, setCantidad] = useState((fila.unidadesTotales ?? 0).toString());
  const [enviando, setEnviando] = useState(false);

  const handleConfirmar = async () => {
    setEnviando(true);
    try {
      await onConfirmar(Number(cantidad));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="saag-modal-overlay">
      <div className="saag-modal-caja">
        <h3 style={{ marginTop: 0 }}>Confirmar cantidad exacta</h3>
        <p style={{ margin: 0, fontSize: 14 }}>
          <strong>Producto:</strong> {fila.productoNombre}
        </p>
        <p style={{ margin: 0, fontSize: 14 }}>
          <strong>Ubicación:</strong> {fila.sucursalNombre}
        </p>
        <p style={{ margin: '8px 0', fontSize: 13, color: 'var(--color-text-muted)' }}>
          Ingresa la cantidad exacta contada físicamente (en unidades sueltas). Esto reemplaza el valor actual y desde ahora las
          ventas descontarán del stock automáticamente.
        </p>
        <input
          className="saag-input-full"
          type="number"
          min={0}
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
        />
        <div className="saag-modal-acciones">
          <button type="button" onClick={onCancelar} className="btn btn-secondary">
            Cancelar
          </button>
          <button type="button" disabled={enviando || cantidad === ''} onClick={handleConfirmar} className="btn btn-primary">
            {enviando ? 'Guardando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}
