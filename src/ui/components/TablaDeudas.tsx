import { Venta } from '../../domain/venta/venta.entity';

interface Props {
  ventas: Venta[];
  mostrarUbicacion: boolean;
  onVerDetalle: (venta: Venta) => void;
  onPagar: (venta: Venta) => void;
  onReportar: (venta: Venta) => void;
}

function diasTranscurridos(fecha: string): number {
  const hoy = new Date();
  const fechaVenta = new Date(fecha);
  const msPorDia = 1000 * 60 * 60 * 24;
  return Math.floor((hoy.setHours(0, 0, 0, 0) - fechaVenta.setHours(0, 0, 0, 0)) / msPorDia);
}

function enlaceWhatsApp(celular: string): string {
  const soloDigitos = celular.replace(/\D/g, '');
  return `https://wa.me/591${soloDigitos}`;
}

export function TablaDeudas({ ventas, mostrarUbicacion, onVerDetalle, onPagar, onReportar }: Props) {
  if (ventas.length === 0) {
    return <p style={{ color: 'var(--color-text-muted)' }}>No hay deudas pendientes acá.</p>;
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Fecha</th>
            <th>Cliente</th>
            {mostrarUbicacion && <th>Ubicación</th>}
            <th>Total</th>
            <th>Días</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => {
            const dias = diasTranscurridos(venta.fecha);
            const esUrgente = dias > 30;
            return (
              <tr key={venta.id}>
                <td>{venta.id}</td>
                <td>{new Date(venta.fecha).toLocaleDateString()}</td>
                <td>
                  {venta.cliente.nombre} {venta.cliente.apellidoPaterno}
                </td>
                {mostrarUbicacion && <td>{venta.sucursal.nombre}</td>}
                <td>Bs {venta.total.toFixed(2)}</td>
                <td>
                  <span className={esUrgente ? 'badge badge-danger' : 'badge badge-warning'}>
                    {dias === 0 ? 'Hoy' : `hace ${dias} día${dias === 1 ? '' : 's'}`}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => onVerDetalle(venta)}>
                      Ver detalle
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => onPagar(venta)}>
                      Pagar
                    </button>
                    <button
                      className={venta.reporte ? 'btn btn-accent btn-sm' : 'btn btn-secondary btn-sm'}
                      onClick={() => onReportar(venta)}
                    >
                      {venta.reporte ? 'Reportado' : 'Reporte'}
                    </button>
                    <a
                      className="btn btn-secondary btn-sm"
                      href={enlaceWhatsApp(venta.cliente.celular)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      WhatsApp
                    </a>
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
