import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerUsuarioActual } from '../../application/auth/useAuth';
import { useVentas } from '../../application/venta/useVentas';
import { Venta } from '../../domain/venta/venta.entity';
import { ModalDetalleVenta } from '../components/ModalDetalleVenta';

function fechaDeHoy(): string {
  const ahora = new Date();
  const offset = ahora.getTimezoneOffset();
  const local = new Date(ahora.getTime() - offset * 60000);
  return local.toISOString().slice(0, 10);
}

const HOY = fechaDeHoy();

export function InicioPage() {
  const usuario = obtenerUsuarioActual();
  const navigate = useNavigate();
  const [ventaDetalle, setVentaDetalle] = useState<Venta | null>(null);

  const { ventas: ventasHoy, cargando: cargandoHoy } = useVentas({ fecha: HOY });
  const { ventas: ultimasVentas, cargando: cargandoUltimas } = useVentas({ page: 1, pageSize: 5 });

  const ventasHoyActivas = ventasHoy.filter((v) => v.estado !== 'CANCELADO');
  const totalVendidoHoy = ventasHoyActivas.reduce((acc, v) => acc + v.total, 0);
  const cantidadVentasHoy = ventasHoyActivas.length;
  const pendientesEntrega = ventasHoyActivas.filter((v) => !v.detalles.every((d) => d.entregado)).length;

  return (
    <div>
      <div className="page-header">
        <h1>
          Hola {usuario?.nombre}
          {usuario?.sucursal ? `, sucursal ${usuario.sucursal.nombre}` : ''}
        </h1>
      </div>

      {cargandoHoy ? (
        <p>Cargando...</p>
      ) : (
        <div className="saag-stat-grid">
          <div className="saag-stat-card">
            <p className="saag-stat-label">Total vendido hoy</p>
            <p className="saag-stat-valor">Bs {totalVendidoHoy.toFixed(2)}</p>
          </div>
          <div className="saag-stat-card">
            <p className="saag-stat-label">Ventas hoy</p>
            <p className="saag-stat-valor">{cantidadVentasHoy}</p>
          </div>
          <div className="saag-stat-card destacada">
            <p className="saag-stat-label">Pendientes de entrega</p>
            <p className="saag-stat-valor">{pendientesEntrega}</p>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', margin: '4px 0 28px' }}>
        <button className="btn btn-primary" style={{ padding: '14px 22px' }} onClick={() => navigate('/panel/ventas/nueva')}>
          + Nueva venta
        </button>
        <button className="btn btn-primary" style={{ padding: '14px 22px' }} onClick={() => navigate('/panel/ventas/dia')}>
          Ventas del día
        </button>
        <button className="btn btn-primary" style={{ padding: '14px 22px' }} onClick={() => navigate('/panel/stock')}>
          Stock
        </button>
      </div>

      <h2 style={{ fontSize: 16, margin: '0 0 12px' }}>Últimas ventas</h2>
      {cargandoUltimas ? (
        <p>Cargando...</p>
      ) : ultimasVentas.length === 0 ? (
        <p>Todavía no hay ventas registradas.</p>
      ) : (
        <div className="card" style={{ padding: 4 }}>
          {ultimasVentas.map((venta, i) => (
            <div
              key={venta.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                borderTop: i === 0 ? undefined : '1px solid var(--color-border)',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ minWidth: 160 }}>
                <strong>
                  {venta.cliente.nombre} {venta.cliente.apellidoPaterno}
                </strong>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{new Date(venta.fecha).toLocaleString()}</div>
              </div>
              <div style={{ fontWeight: 600 }}>Bs {venta.total.toFixed(2)}</div>
              <button className="btn btn-secondary btn-sm" onClick={() => setVentaDetalle(venta)}>
                Ver detalle
              </button>
            </div>
          ))}
        </div>
      )}

      {ventaDetalle && <ModalDetalleVenta venta={ventaDetalle} onCerrar={() => setVentaDetalle(null)} />}
    </div>
  );
}
