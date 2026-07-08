import { useRef, useState } from 'react';
import { productoApiRepository } from '../../infrastructure/api/producto.api';
import { ResultadoImportacion } from '../../application/producto/producto.port';
import { IconoExcel } from './IconoExcel';
import './modal.css';

interface Props {
  onImportado: () => void;
}

export function ImportarExcelProductos({ onImportado }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoImportacion | null>(null);
  const [error, setError] = useState<string | null>(null);

  const descargarPlantilla = async () => {
    const blob = await productoApiRepository.descargarPlantilla();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_productos.xlsx';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleArchivoSeleccionado = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    if (!archivo.name.toLowerCase().endsWith('.xlsx')) {
      setError('Solo se aceptan archivos .xlsx');
      e.target.value = '';
      return;
    }

    setError(null);
    setCargando(true);
    try {
      const res = await productoApiRepository.importar(archivo);
      setResultado(res);
      onImportado();
    } catch {
      setError('No se pudo importar el archivo');
    } finally {
      setCargando(false);
      e.target.value = '';
    }
  };

  const cerrarPopup = () => {
    setMostrarPopup(false);
    setResultado(null);
    setError(null);
  };

  return (
    <>
      <button onClick={() => setMostrarPopup(true)} style={botonPrincipal}>
        <IconoExcel size={18} />
        Agregar más productos
      </button>

      {mostrarPopup && (
        <div className="saag-modal-overlay">
          <div className="saag-modal-caja">
            <h3 style={{ marginTop: 0 }}>Agregar productos desde Excel</h3>

            {!resultado ? (
              <>
                <p style={{ color: '#555', fontSize: 14, margin: 0 }}>
                  Descarga la plantilla de ejemplo, llénala con tus productos y precios, y luego súbela aquí.
                </p>

                <button onClick={descargarPlantilla} style={botonSecundario}>
                  <IconoExcel size={16} /> Descargar plantilla de ejemplo
                </button>

                <button onClick={() => inputRef.current?.click()} disabled={cargando} style={botonPrimario}>
                  <IconoExcel size={16} /> {cargando ? 'Importando...' : 'Importar archivo Excel'}
                </button>

                <input
                  ref={inputRef}
                  type="file"
                  accept=".xlsx"
                  onChange={handleArchivoSeleccionado}
                  style={{ display: 'none' }}
                />

                {error && <p style={{ color: '#a01a1a', fontSize: 13, margin: 0 }}>{error}</p>}
              </>
            ) : (
              <div style={{ fontSize: 14 }}>
                <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#1a7a1a' }}>
                  {resultado.creados} producto(s) importado(s) correctamente.
                </p>
                {resultado.errores.length > 0 && (
                  <>
                    <p style={{ margin: '6px 0', fontWeight: 700, color: '#a01a1a' }}>
                      {resultado.errores.length} fila(s) con error:
                    </p>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {resultado.errores.map((e, i) => (
                        <li key={i}>
                          Fila {e.fila}: {e.mensaje}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}

            <div className="saag-modal-acciones">
              <button type="button" onClick={cerrarPopup} style={botonSecundario}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const botonPrincipal = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  background: '#e8e0d3',
  color: '#1a1a1a',
  border: '1px solid #cfc3ac',
  padding: '10px 16px',
  borderRadius: 6,
  cursor: 'pointer',
  fontSize: 14,
} as const;

const botonPrimario = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  justifyContent: 'center',
  background: '#e8e0d3',
  color: '#1a1a1a',
  border: '1px solid #cfc3ac',
  padding: '10px 16px',
  borderRadius: 6,
  cursor: 'pointer',
  width: '100%',
} as const;

const botonSecundario = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  justifyContent: 'center',
  background: 'transparent',
  color: '#1a1a1a',
  border: '1px solid #1a1a1a',
  padding: '10px 16px',
  borderRadius: 6,
  cursor: 'pointer',
  width: '100%',
} as const;
