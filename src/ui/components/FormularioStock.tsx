import { FormEvent, useState } from 'react';
import { StockConDetalle } from '../../domain/stock/stock.entity';
import { Producto } from '../../domain/producto/producto.entity';
import './modal.css';

interface OpcionSimple {
  id: number;
  nombre: string;
}

interface Props {
  filaInicial?: StockConDetalle;
  productos: Producto[];
  sucursales: OpcionSimple[];
  onCancelar: () => void;
  onGuardar: (dto: any) => Promise<void>;
}

function formatearDesglose(fila: StockConDetalle): string {
  if (fila.unidadesTotales === null) return 'Sin contar';
  const partes: string[] = [];
  if (fila.cajas !== null) partes.push(`${fila.cajas} caja${fila.cajas === 1 ? '' : 's'}`);
  if (fila.paquetes !== null) partes.push(`${fila.paquetes} paquete${fila.paquetes === 1 ? '' : 's'}`);
  if (fila.piezasSueltas !== null) partes.push(`${fila.piezasSueltas} pieza${fila.piezasSueltas === 1 ? '' : 's'}`);
  return `${partes.join(', ')} (${fila.unidadesTotales} u.)`;
}

export function FormularioStock({ filaInicial, productos, sucursales, onCancelar, onGuardar }: Props) {
  const esEdicion = Boolean(filaInicial);
  const [productoId, setProductoId] = useState(filaInicial?.productoId?.toString() ?? '');
  const [sucursalId, setSucursalId] = useState(filaInicial?.sucursalId?.toString() ?? '');
  const [area, setArea] = useState(filaInicial?.area ?? '');
  const [cajas, setCajas] = useState('');
  const [piezas, setPiezas] = useState('');
  const [enviando, setEnviando] = useState(false);

  const productoSeleccionado = productos.find((p) => p.id.toString() === productoId);
  const unidadesPorCaja = esEdicion ? filaInicial!.unidadesPorCaja : productoSeleccionado?.unidadesPorCaja ?? null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await onGuardar({
        productoId: Number(productoId),
        sucursalId: Number(sucursalId),
        area: area || undefined,
        cajas: cajas !== '' ? Number(cajas) : undefined,
        piezas: piezas !== '' ? Number(piezas) : undefined,
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="saag-modal-overlay">
      <form onSubmit={handleSubmit} className="saag-modal-caja">
        <h3 style={{ marginTop: 0 }}>{esEdicion ? 'Agregar más stock' : 'Agregar stock'}</h3>

        {esEdicion ? (
          <>
            <p style={{ margin: 0, fontSize: 14 }}>
              <strong>Producto:</strong> {filaInicial!.productoNombre}
            </p>
            <p style={{ margin: 0, fontSize: 14 }}>
              <strong>Ubicación:</strong> {filaInicial!.sucursalNombre}
            </p>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-muted)' }}>
              Actualmente: {formatearDesglose(filaInicial!)}
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

        {unidadesPorCaja ? (
          <input
            className="saag-input-full"
            placeholder="Cajas a agregar"
            type="number"
            min={0}
            value={cajas}
            onChange={(e) => setCajas(e.target.value)}
          />
        ) : null}

        <input
          className="saag-input-full"
          placeholder="Piezas sueltas a agregar"
          type="number"
          min={0}
          value={piezas}
          onChange={(e) => setPiezas(e.target.value)}
        />

        <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)' }}>
          Lo que ingreses se suma a lo que ya había — no lo reemplaza.
        </p>

        <div className="saag-modal-acciones">
          <button type="button" onClick={onCancelar} className="btn btn-secondary">
            Cancelar
          </button>
          <button type="submit" disabled={enviando} className="btn btn-primary">
            {enviando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
}
