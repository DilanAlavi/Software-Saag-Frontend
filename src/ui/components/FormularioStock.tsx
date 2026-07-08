import { FormEvent, useState } from 'react';
import { StockConDetalle } from '../../domain/stock/stock.entity';
import './modal.css';

interface OpcionSimple {
  id: number;
  nombre: string;
}

interface Props {
  filaInicial?: StockConDetalle;
  productos: OpcionSimple[];
  sucursales: OpcionSimple[];
  onCancelar: () => void;
  onGuardar: (dto: any) => Promise<void>;
}

export function FormularioStock({ filaInicial, productos, sucursales, onCancelar, onGuardar }: Props) {
  const esEdicion = Boolean(filaInicial);
  const [productoId, setProductoId] = useState(filaInicial?.productoId?.toString() ?? '');
  const [sucursalId, setSucursalId] = useState(filaInicial?.sucursalId?.toString() ?? '');
  const [area, setArea] = useState(filaInicial?.area ?? '');
  const [cantidad, setCantidad] = useState(filaInicial?.cantidad?.toString() ?? '');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await onGuardar({
        productoId: Number(productoId),
        sucursalId: Number(sucursalId),
        area: area || undefined,
        cantidad: cantidad !== '' ? Number(cantidad) : undefined,
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="saag-modal-overlay">
      <form onSubmit={handleSubmit} className="saag-modal-caja">
        <h3 style={{ marginTop: 0 }}>{esEdicion ? 'Editar stock' : 'Agregar stock'}</h3>

        {esEdicion ? (
          <>
            <p style={{ margin: 0, fontSize: 14 }}>
              <strong>Producto:</strong> {filaInicial!.productoNombre}
            </p>
            <p style={{ margin: 0, fontSize: 14 }}>
              <strong>Ubicación:</strong> {filaInicial!.sucursalNombre}
            </p>
          </>
        ) : (
          <>
            <select className="saag-input-full" value={productoId} onChange={(e) => setProductoId(e.target.value)} required>
              <option value="">Selecciona un producto</option>
              {productos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
            <select className="saag-input-full" value={sucursalId} onChange={(e) => setSucursalId(e.target.value)} required>
              <option value="">Selecciona una ubicación</option>
              {sucursales.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </>
        )}

        <input
          className="saag-input-full"
          placeholder="Área dentro de la tienda (opcional)"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />
        <input
          className="saag-input-full"
          placeholder="Cantidad (opcional)"
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
        />

        <div className="saag-modal-acciones">
          <button type="button" onClick={onCancelar} style={botonSecundario}>
            Cancelar
          </button>
          <button type="submit" disabled={enviando} style={botonPrimario}>
            {enviando ? 'Guardando...' : 'Guardar'}
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
