import { VentaConGanancia } from '../../domain/ganancia/ganancia.entity';

interface Props {
  ventas: VentaConGanancia[];
  onVerDetalle: (venta: VentaConGanancia) => void;
}

export function TablaVentasGanancia({ ventas, onVerDetalle }: Props) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Vendedor</th>
            <th>Cant.</th>
            <th>Total venta</th>
            <th>Ganancia</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => {
            const cantidad = venta.detalles.reduce((acc, d) => acc + d.cantidad, 0);
            return (
              <tr key={venta.id}>
                <td>{venta.id}</td>
                <td>{new Date(venta.fecha).toLocaleString()}</td>
                <td>
                  {venta.cliente.nombre} {venta.cliente.apellidoPaterno}
                </td>
                <td>
                  {venta.usuario.nombre} {venta.usuario.apellidoPaterno}
                </td>
                <td>{cantidad}</td>
                <td>Bs {venta.total.toFixed(2)}</td>
                <td>
                  <strong style={{ color: 'var(--color-success)' }}>Bs {venta.gananciaTotal.toFixed(2)}</strong>
                </td>
                <td>
                  <button className="btn btn-secondary btn-sm" onClick={() => onVerDetalle(venta)}>
                    Ver detalle
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
