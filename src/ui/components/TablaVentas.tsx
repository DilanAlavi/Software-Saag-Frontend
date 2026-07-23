import { useState } from 'react';
import { ETIQUETAS_ESTADO_VENTA, Venta } from '../../domain/venta/venta.entity';
import { construirTicket } from '../../application/impresion/ticket58mm';
import { imprimirTicket58mm } from '../../application/impresion/imprimirBluetooth';

interface Props {
  ventas: Venta[];
  onVerDetalle: (venta: Venta) => void;
  onPagar: (venta: Venta) => void;
  onCancelar: (venta: Venta) => void;
  onEntregar: (venta: Venta) => void;
  onReportar: (venta: Venta) => void;
  onDescargarProforma: (id: number) => void;
}

function claseBadgeEstado(estado: Venta['estado']) {
  if (estado === 'PAGADO') return 'badge badge-success';
  if (estado === 'CANCELADO') return 'badge badge-danger';
  return 'badge badge-warning';
}

export function TablaVentas({ ventas, onVerDetalle, onPagar, onCancelar, onEntregar, onReportar, onDescargarProforma }: Props) {
  const [imprimiendoId, setImprimiendoId] = useState<number | null>(null);

  const handleImprimir = async (venta: Venta) => {
    setImprimiendoId(venta.id);
    try {
      const texto = construirTicket({
        id: venta.id,
        fecha: venta.fecha,
        cliente: `${venta.cliente.nombre} ${venta.cliente.apellidoPaterno}`,
        atendidoPor: `${venta.usuario.nombre} ${venta.usuario.apellidoPaterno}`,
        sucursal: venta.sucursal.nombre,
        items: venta.detalles.map((d) => ({
          nombre: d.nombreProducto,
          cantidad: d.cantidad,
          unidadVenta: d.unidadVenta,
          unidadVentaTamano: d.unidadVentaTamano,
          precioUnitario: d.precioUnitario,
          total: d.total,
        })),
        total: venta.total,
      });
      await imprimirTicket58mm(texto);
    } catch (e: any) {
      alert(e?.message || 'No se pudo imprimir el ticket.');
    } finally {
      setImprimiendoId(null);
    }
  };

  return (
    <div className="table-wrap table-wrap-scroll">
      <table className="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Sucursal</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => {
            const yaEntregado = venta.detalles.every((d) => d.entregado);
            return (
              <tr key={venta.id}>
                <td>{venta.id}</td>
                <td>{new Date(venta.fecha).toLocaleString()}</td>
                <td>
                  {venta.cliente.nombre} {venta.cliente.apellidoPaterno}
                </td>
                <td>{venta.sucursal.nombre}</td>
                <td>Bs {venta.total.toFixed(2)}</td>
                <td>
                  <span className={claseBadgeEstado(venta.estado)}>{ETIQUETAS_ESTADO_VENTA[venta.estado]}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => onVerDetalle(venta)}>
                      Ver detalle
                    </button>
                    {venta.estado === 'PENDIENTE' && (
                      <>
                        <button className="btn btn-primary btn-sm" onClick={() => onPagar(venta)}>
                          Pagar
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => onCancelar(venta)}>
                          Reportar cancelación
                        </button>
                      </>
                    )}
                    {venta.estado !== 'CANCELADO' && (
                      <button
                        className={yaEntregado ? 'btn btn-secondary btn-sm' : 'btn btn-secondary btn-sm'}
                        onClick={() => onEntregar(venta)}
                      >
                        {yaEntregado ? 'Entregado ✓' : 'Entrega'}
                      </button>
                    )}
                    <button
                      className={venta.reporte ? 'btn btn-accent btn-sm' : 'btn btn-secondary btn-sm'}
                      onClick={() => onReportar(venta)}
                    >
                      {venta.reporte ? 'Reportado' : 'Reporte'}
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => onDescargarProforma(venta.id)}>
                      Proforma
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      disabled={imprimiendoId === venta.id}
                      onClick={() => handleImprimir(venta)}
                    >
                      {imprimiendoId === venta.id ? 'Imprimiendo...' : 'Imprimir'}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
