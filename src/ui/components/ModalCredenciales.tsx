import { useState } from 'react';
import * as XLSX from 'xlsx';
import './modal.css';

interface Props {
  visible: boolean;
  nombreCompleto: string;
  username: string;
  password: string;
  onCerrar: () => void;
}

export function ModalCredenciales({ visible, nombreCompleto, username, password, onCerrar }: Props) {
  const [copiado, setCopiado] = useState(false);

  if (!visible) return null;

  const copiar = async () => {
    await navigator.clipboard.writeText(`Usuario: ${username}\nContraseña: ${password}`);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const descargar = () => {
    const hoja = XLSX.utils.json_to_sheet([
      { Nombre: nombreCompleto, Usuario: username, Contraseña: password },
    ]);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Credenciales');
    XLSX.writeFile(libro, `credenciales_${username}.xlsx`);
  };

  return (
    <div className="saag-modal-overlay">
      <div className="saag-modal-caja">
        <h3 style={{ margin: 0 }}>Usuario creado correctamente</h3>
        <p style={{ margin: 0 }}>{nombreCompleto}</p>
        <div style={{ background: 'var(--color-surface-alt)', border: '1px solid var(--color-border)', borderRadius: 8, padding: 12, wordBreak: 'break-word' }}>
          <p style={{ margin: '4px 0' }}>
            <strong>Usuario:</strong> {username}
          </p>
          <p style={{ margin: '4px 0' }}>
            <strong>Contraseña:</strong> {password}
          </p>
        </div>
        <p style={{ fontSize: 13, color: 'var(--color-danger)', margin: 0 }}>
          Guarda esta información ahora — no se volverá a mostrar.
        </p>
        <div className="saag-modal-acciones">
          <button onClick={copiar} className="btn btn-secondary">
            {copiado ? 'Copiado ✓' : 'Copiar'}
          </button>
          <button onClick={descargar} className="btn btn-secondary">
            Descargar Excel
          </button>
          <button onClick={onCerrar} className="btn btn-primary">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
