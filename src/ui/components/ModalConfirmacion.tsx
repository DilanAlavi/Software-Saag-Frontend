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
          <button onClick={onCancelar} className="btn btn-secondary">
            Cancelar
          </button>
          <button onClick={onAceptar} className="btn btn-primary">
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
