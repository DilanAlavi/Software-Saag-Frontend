import './modal.css';

interface Props {
  visible: boolean;
  mensaje: string;
  onAceptar: () => void;
  onCancelar: () => void;
}

export function ModalConfirmacion({ visible, mensaje, onAceptar, onCancelar }: Props) {
  if (!visible) return null;

  return (
    <div className="saag-modal-overlay">
      <div className="saag-modal-caja">
        <p style={{ margin: 0, fontSize: 15 }}>{mensaje}</p>
        <div className="saag-modal-acciones">
          <button onClick={onCancelar} style={botonSecundario}>
            Cancelar
          </button>
          <button onClick={onAceptar} style={botonPrimario}>
            Aceptar
          </button>
        </div>
      </div>
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
