import { VentaConGanancia } from '../../domain/ganancia/ganancia.entity';
import './modal.css';

interface Props {
  venta: VentaConGanancia;
  onCerrar: () => void;
}

export function ModalDetalleGanancia({ venta, onCerrar }: Props) {
  return (
    <div className="saag-modal-overlay" onClick={onCerrar}>
      <div className="saag-modal-caja ancho" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3>Venta #{venta.id}</h3>
            <p style={{ margin: '4px 0 0', color: 'var(--color-text-muted)', fontSize: 13 }}>
              {new Date(venta.fecha).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid-2" style={{ gap: 14 }}>
          <div>
            <p style={etiqueta}>Cliente</p>
            <p style={valor}>
              {venta.cliente.nombre} {venta.cliente.apellidoPaterno}
            </p>
          </div>
          <div>
            <p style={etiqueta}>Atendido por</p>
            <p style={valor}>
              {venta.usuario.nombre} {venta.usuario.apellidoPaterno}
            </p>
            <p style={{ ...valor, color: 'var(--color-text-muted)', fontSize: 13 }}>{venta.sucursal.nombre}</p>
          </div>
        </div>

        <div className="table-wrap" style={{ marginTop: 4 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cant.</th>
                <th>Precio venta</th>
                <th>Costo</th>
                <th>Total</th>
                <th>Ganancia</th>
              </tr>
            </thead>
            <tbody>
              {venta.detalles.map((d) => (
                <tr key={d.id}>
                  <td>{d.nombreProducto}</td>
                  <td>{d.cantidad}</td>
                  <td>Bs {d.precioUnitario.toFixed(2)}</td>
                  <td>Bs {d.costoUnitario.toFixed(2)}</td>
                  <td>Bs {d.total.toFixed(2)}</td>
                  <td>
                    <strong style={{ color: 'var(--color-success)' }}>Bs {d.ganancia.toFixed(2)}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ minWidth: 220 }}>
            <div style={filaTotal}>
              <span>Total venta</span>
              <strong>Bs {venta.total.toFixed(2)}</strong>
            </div>
            <div style={filaTotal}>
              <span>Ganancia total</span>
              <strong style={{ color: 'var(--color-success)' }}>Bs {venta.gananciaTotal.toFixed(2)}</strong>
            </div>
          </div>
        </div>

        <div className="saag-modal-acciones">
          <button type="button" className="btn btn-secondary" onClick={onCerrar}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

const etiqueta = { margin: 0, fontSize: 12, color: 'var(--color-text-muted)', textTransform: 'uppercase' as const, letterSpacing: '0.04em' };
const valor = { margin: '2px 0 0', fontSize: 15, fontWeight: 600, color: 'var(--color-text)' };
const filaTotal = { display: 'flex', justifyContent: 'space-between', gap: 20, fontSize: 14, padding: '4px 0' } as const;
