import { FormEvent, useState } from 'react';
import './modal.css';

interface Props {
  onCancelar: () => void;
  onCrear: (dto: any) => Promise<void>;
}

export function FormularioProducto({ onCancelar, onCrear }: Props) {
  const [nombre, setNombre] = useState('');
  const [nombresAlternativos, setNombresAlternativos] = useState('');
  const [marca, setMarca] = useState('');
  const [tipoProducto, setTipoProducto] = useState('FERRETERIA');
  const [codigo, setCodigo] = useState('');
  const [cantidad, setCantidad] = useState('0');
  const [precioCosto, setPrecioCosto] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await onCrear({
        nombre,
        nombresAlternativos: nombresAlternativos
          ? nombresAlternativos.split(',').map((n) => n.trim()).filter(Boolean)
          : undefined,
        marca: marca || undefined,
        tipoProducto,
        codigo: codigo || undefined,
        cantidad: cantidad ? Number(cantidad) : undefined,
        precioCosto: precioCosto ? Number(precioCosto) : undefined,
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="saag-modal-overlay">
      <form onSubmit={handleSubmit} className="saag-modal-caja">
        <h3 style={{ marginTop: 0 }}>Agregar nuevo producto</h3>

        <input className="saag-input-full" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        <input
          className="saag-input-full"
          placeholder="Nombres alternativos (separados por coma)"
          value={nombresAlternativos}
          onChange={(e) => setNombresAlternativos(e.target.value)}
        />
        <input className="saag-input-full" placeholder="Marca (opcional)" value={marca} onChange={(e) => setMarca(e.target.value)} />
        <select className="saag-input-full" value={tipoProducto} onChange={(e) => setTipoProducto(e.target.value)}>
          <option value="FERRETERIA">Ferretería</option>
          <option value="CARPINTERIA">Carpintería</option>
          <option value="PLOMERIA">Plomería</option>
          <option value="ELECTRICO">Eléctrico</option>
        </select>
        <input
          className="saag-input-full"
          placeholder="Código de barras (opcional)"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />
        <input
          className="saag-input-full"
          placeholder="Cantidad"
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
        />
        <input
          className="saag-input-full"
          placeholder="Precio de costo (opcional)"
          type="number"
          value={precioCosto}
          onChange={(e) => setPrecioCosto(e.target.value)}
        />

        <div className="saag-modal-acciones">
          <button type="button" onClick={onCancelar} style={botonSecundario}>
            Cancelar
          </button>
          <button type="submit" disabled={enviando} style={botonPrimario}>
            {enviando ? 'Creando...' : 'Aceptar'}
          </button>
        </div>
      </form>
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
