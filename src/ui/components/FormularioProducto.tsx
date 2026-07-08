import { FormEvent, useState } from 'react';
import { Producto } from '../../domain/producto/producto.entity';
import './modal.css';

interface Props {
  productoInicial?: Producto;
  onCancelar: () => void;
  onGuardar: (dto: any) => Promise<void>;
}

export function FormularioProducto({ productoInicial, onCancelar, onGuardar }: Props) {
  const esEdicion = Boolean(productoInicial);
  const [nombre, setNombre] = useState(productoInicial?.nombre ?? '');
  const [nombresAlternativos, setNombresAlternativos] = useState(
    productoInicial?.nombresAlternativos.join(', ') ?? '',
  );
  const [marca, setMarca] = useState(productoInicial?.marca ?? '');
  const [tipoProducto, setTipoProducto] = useState<string>(productoInicial?.tipoProducto ?? 'FERRETERIA');
  const [codigo, setCodigo] = useState(productoInicial?.codigo ?? '');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await onGuardar({
        nombre,
        nombresAlternativos: nombresAlternativos
          ? nombresAlternativos.split(',').map((n) => n.trim()).filter(Boolean)
          : undefined,
        marca: marca || undefined,
        tipoProducto,
        codigo: codigo || undefined,
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="saag-modal-overlay">
      <form onSubmit={handleSubmit} className="saag-modal-caja">
        <h3 style={{ marginTop: 0 }}>{esEdicion ? 'Editar producto' : 'Agregar nuevo producto'}</h3>

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
          placeholder="Código del producto (opcional)"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />

        <div className="saag-modal-acciones">
          <button type="button" onClick={onCancelar} style={botonSecundario}>
            Cancelar
          </button>
          <button type="submit" disabled={enviando} style={botonPrimario}>
            {enviando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Aceptar'}
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
