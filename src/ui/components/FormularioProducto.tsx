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
  const [unidadesPorPaquete, setUnidadesPorPaquete] = useState(
    productoInicial?.unidadesPorPaquete?.toString() ?? '',
  );
  const [unidadesPorCaja, setUnidadesPorCaja] = useState(productoInicial?.unidadesPorCaja?.toString() ?? '');
  const [ventaSoloPorPaquete, setVentaSoloPorPaquete] = useState(productoInicial?.ventaSoloPorPaquete ?? false);
  const [unidadVenta, setUnidadVenta] = useState(productoInicial?.unidadVenta ?? '');
  const [unidadVentaTamano, setUnidadVentaTamano] = useState(
    productoInicial?.unidadVentaTamano?.toString() ?? '',
  );
  const [redondeoSiempreArriba, setRedondeoSiempreArriba] = useState(
    productoInicial?.redondeoSiempreArriba ?? false,
  );
  const [notaVenta, setNotaVenta] = useState(productoInicial?.notaVenta ?? '');
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
        unidadesPorPaquete: unidadesPorPaquete ? Number(unidadesPorPaquete) : undefined,
        unidadesPorCaja: unidadesPorCaja ? Number(unidadesPorCaja) : undefined,
        ventaSoloPorPaquete,
        unidadVenta: unidadVenta || undefined,
        unidadVentaTamano: unidadVentaTamano ? Number(unidadVentaTamano) : undefined,
        redondeoSiempreArriba,
        notaVenta: notaVenta || undefined,
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

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '4px 0' }} />
        <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-muted)' }}>Empaquetado (opcional)</p>

        <input
          className="saag-input-full"
          placeholder="Unidades por paquete (ej. 10)"
          type="number"
          value={unidadesPorPaquete}
          onChange={(e) => setUnidadesPorPaquete(e.target.value)}
        />
        <input
          className="saag-input-full"
          placeholder="Unidades por caja (ej. 100)"
          type="number"
          value={unidadesPorCaja}
          onChange={(e) => setUnidadesPorCaja(e.target.value)}
        />
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
          <input
            type="checkbox"
            checked={ventaSoloPorPaquete}
            onChange={(e) => setVentaSoloPorPaquete(e.target.checked)}
          />
          Vender solo por paquete completo (no se puede vender suelto)
        </label>
        <select className="saag-input-full" value={unidadVenta} onChange={(e) => setUnidadVenta(e.target.value)}>
          <option value="">Unidad de venta: pcs (por defecto)</option>
          <option value="par">Unidad de venta: par</option>
          <option value="juego">Unidad de venta: juego</option>
        </select>
        {unidadVenta && (
          <input
            className="saag-input-full"
            placeholder={`Cuántas piezas hace 1 ${unidadVenta} (ej. 2)`}
            type="number"
            value={unidadVentaTamano}
            onChange={(e) => setUnidadVentaTamano(e.target.value)}
          />
        )}
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
          <input
            type="checkbox"
            checked={redondeoSiempreArriba}
            onChange={(e) => setRedondeoSiempreArriba(e.target.checked)}
          />
          Redondear siempre hacia arriba (sin dejar centavos)
        </label>
        <input
          className="saag-input-full"
          placeholder='Aviso para el vendedor (ej. "Se vende de 3 en 3")'
          value={notaVenta}
          onChange={(e) => setNotaVenta(e.target.value)}
        />

        <div className="saag-modal-acciones">
          <button type="button" onClick={onCancelar} className="btn btn-secondary">
            Cancelar
          </button>
          <button type="submit" disabled={enviando} className="btn btn-primary">
            {enviando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Aceptar'}
          </button>
        </div>
      </form>
    </div>
  );
}
