import { ETIQUETAS_ESTADO_VENTA, ETIQUETAS_MOTIVO_CANCELACION, Venta } from '../../domain/venta/venta.entity';
import './modal.css';

interface Props {
  venta: Venta;
  onCerrar: () => void;
}

function claseBadgeEstado(estado: Venta['estado']) {
  if (estado === 'PAGADO') return 'badge badge-success';
  if (estado === 'CANCELADO') return 'badge badge-danger';
  return 'badge badge-warning';
}

export function ModalDetalleVenta({ venta, onCerrar }: Props) {
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
          <span className={claseBadgeEstado(venta.estado)}>{ETIQUETAS_ESTADO_VENTA[venta.estado]}</span>
        </div>

        {venta.motivoCancelacion && (
          <div
            style={{
              background: 'var(--color-danger-soft)',
              color: 'var(--color-danger)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Cancelada: {ETIQUETAS_MOTIVO_CANCELACION[venta.motivoCancelacion]}
          </div>
        )}

        <div className="grid-2" style={{ gap: 14 }}>
          <div>
            <p style={etiqueta}>Cliente</p>
            <p style={valor}>
              {venta.cliente.nombre} {venta.cliente.apellidoPaterno}
            </p>
            <p style={{ ...valor, color: 'var(--color-text-muted)', fontSize: 13 }}>{venta.cliente.celular || 'Sin celular'}</p>
          </div>
          <div>
            <p style={etiqueta}>Atendido por</p>
            <p style={valor}>
              {venta.usuario.nombre} {venta.usuario.apellidoPaterno}
            </p>
            <p style={{ ...valor, color: 'var(--color-text-muted)', fontSize: 13 }}>{venta.sucursal.nombre}</p>
          </div>
        </div>

        {venta.reporte && (
          <div
            style={{
              background: 'var(--color-warning-soft)',
              color: 'var(--color-warning)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              fontSize: 13,
            }}
          >
            <strong>Reporte:</strong> {venta.reporte}
            {venta.fechaReporte && (
              <div style={{ fontSize: 11, marginTop: 2, opacity: 0.85 }}>{new Date(venta.fechaReporte).toLocaleString()}</div>
            )}
          </div>
        )}

        <div className="table-wrap" style={{ marginTop: 4 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cant.</th>
                <th>Precio</th>
                <th>Total</th>
                <th>Entrega</th>
              </tr>
            </thead>
            <tbody>
              {venta.detalles.map((d) => (
                <tr key={d.id}>
                  <td>{d.nombreProducto}</td>
                  <td>{d.cantidad}</td>
                  <td>Bs {d.precioUnitario.toFixed(2)}</td>
                  <td>Bs {d.total.toFixed(2)}</td>
                  <td>
                    <span className={d.entregado ? 'badge badge-success' : 'badge badge-neutral'}>
                      {d.entregado ? 'Entregado' : 'Pendiente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ minWidth: 220 }}>
            <div style={filaTotal}>
              <span>Total</span>
              <strong>Bs {venta.total.toFixed(2)}</strong>
            </div>
            {venta.efectivoRecibido !== null && (
              <>
                <div style={filaTotal}>
                  <span>Efectivo recibido</span>
                  <span>Bs {venta.efectivoRecibido.toFixed(2)}</span>
                </div>
                <div style={filaTotal}>
                  <span>Vuelto</span>
                  <span>Bs {(venta.vuelto ?? 0).toFixed(2)}</span>
                </div>
              </>
            )}
            {venta.fechaPago && (
              <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--color-text-muted)', textAlign: 'right' }}>
                Pagado el {new Date(venta.fechaPago).toLocaleString()}
              </p>
            )}
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
