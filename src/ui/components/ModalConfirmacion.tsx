import type { CSSProperties } from 'react';

interface Props {
  visible: boolean;
  mensaje: string;
  onAceptar: () => void;
  onCancelar: () => void;
}

export function ModalConfirmacion({ visible, mensaje, onAceptar, onCancelar }: Props) {
  if (!visible) return null;

  return (
    <div style={overlayStyle}>
      <div style={cajaStyle}>
        <p style={{ marginBottom: 20, fontSize: 15 }}>{mensaje}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
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

const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
};

const cajaStyle: CSSProperties = {
  background: '#faf6ef',
  padding: 24,
  borderRadius: 8,
  minWidth: 320,
  maxWidth: 420,
};

const botonPrimario: CSSProperties = {
  background: '#1a1a1a',
  color: '#faf6ef',
  border: 'none',
  padding: '8px 16px',
  borderRadius: 6,
  cursor: 'pointer',
};

const botonSecundario: CSSProperties = {
  background: 'transparent',
  color: '#1a1a1a',
  border: '1px solid #1a1a1a',
  padding: '8px 16px',
  borderRadius: 6,
  cursor: 'pointer',
};
