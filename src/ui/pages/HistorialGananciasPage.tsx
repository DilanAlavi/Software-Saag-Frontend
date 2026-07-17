import { useState } from 'react';
import {
  useHistorialGananciasAnual,
  useHistorialGananciasMensual,
  useUltimasVentasGanancia,
} from '../../application/ganancia/useGanancias';
import { VentaConGanancia } from '../../domain/ganancia/ganancia.entity';
import { TablaVentasGanancia } from '../components/TablaVentasGanancia';
import { ModalDetalleGanancia } from '../components/ModalDetalleGanancia';

function mesActual(): string {
  const ahora = new Date();
  return `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}`;
}

function restarMeses(mes: string, cantidad: number): string {
  const [anio, mesNumero] = mes.split('-').map(Number);
  const fecha = new Date(anio, mesNumero - 1 - cantidad, 1);
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
}

function nombreMes(mes: string): string {
  const [anio, mesNumero] = mes.split('-');
  const fecha = new Date(Number(anio), Number(mesNumero) - 1, 1);
  const nombre = fecha.toLocaleDateString('es-BO', { month: 'long', year: 'numeric' });
  return nombre.charAt(0).toUpperCase() + nombre.slice(1);
}

const HASTA_POR_DEFECTO = mesActual();
const DESDE_POR_DEFECTO = restarMeses(HASTA_POR_DEFECTO, 4);

export function HistorialGananciasPage() {
  const { ventas, cargando: cargandoVentas } = useUltimasVentasGanancia(10);
  const [ventaDetalle, setVentaDetalle] = useState<VentaConGanancia | null>(null);

  const [desde, setDesde] = useState(DESDE_POR_DEFECTO);
  const [hasta, setHasta] = useState(HASTA_POR_DEFECTO);
  const { historial, cargando: cargandoHistorial } = useHistorialGananciasMensual(desde, hasta);
  const { historial: historialAnual, cargando: cargandoAnual } = useHistorialGananciasAnual();

  return (
    <div>
      <div className="page-header">
        <h1>Historial de Ganancias</h1>
      </div>

      <h2 style={{ fontSize: 16, margin: '0 0 12px' }}>Últimas 10 ventas</h2>
      {cargandoVentas ? (
        <p>Cargando...</p>
      ) : ventas.length === 0 ? (
        <p>Todavía no hay ventas pagadas registradas.</p>
      ) : (
        <TablaVentasGanancia ventas={ventas} onVerDetalle={setVentaDetalle} />
      )}

      <h2 style={{ fontSize: 16, margin: '28px 0 12px' }}>Ganancias por mes</h2>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <label style={{ fontSize: 13, color: 'var(--color-text-muted)', display: 'flex', gap: 6, alignItems: 'center' }}>
          Desde
          <input
            className="input"
            type="month"
            value={desde}
            max={hasta}
            onChange={(e) => setDesde(e.target.value)}
            style={{ maxWidth: 160 }}
          />
        </label>
        <label style={{ fontSize: 13, color: 'var(--color-text-muted)', display: 'flex', gap: 6, alignItems: 'center' }}>
          Hasta
          <input
            className="input"
            type="month"
            value={hasta}
            min={desde}
            onChange={(e) => setHasta(e.target.value)}
            style={{ maxWidth: 160 }}
          />
        </label>
      </div>

      {cargandoHistorial || !historial ? (
        <p>Cargando...</p>
      ) : (
        <>
          <div className="table-wrap table-wrap-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mes</th>
                  <th>Cant. ventas</th>
                  <th>Ingreso total</th>
                  <th>Ganancia total</th>
                </tr>
              </thead>
              <tbody>
                {historial.meses.map((m) => (
                  <tr key={m.mes}>
                    <td>{nombreMes(m.mes)}</td>
                    <td>{m.cantidadVentas}</td>
                    <td>Bs {m.ingresoTotal.toFixed(2)}</td>
                    <td>
                      <strong style={{ color: 'var(--color-success)' }}>Bs {m.gananciaTotal.toFixed(2)}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="saag-stat-grid" style={{ marginTop: 16 }}>
            <div className="saag-stat-card">
              <p className="saag-stat-label">Total de ventas</p>
              <p className="saag-stat-valor">{historial.totalGeneral.cantidadVentas}</p>
            </div>
            <div className="saag-stat-card">
              <p className="saag-stat-label">Ingreso total</p>
              <p className="saag-stat-valor">Bs {historial.totalGeneral.ingresoTotal.toFixed(2)}</p>
            </div>
            <div className="saag-stat-card destacada">
              <p className="saag-stat-label">Ganancia total del rango</p>
              <p className="saag-stat-valor">Bs {historial.totalGeneral.gananciaTotal.toFixed(2)}</p>
            </div>
          </div>
        </>
      )}

      <h2 style={{ fontSize: 16, margin: '28px 0 12px' }}>Ganancias por año</h2>
      {cargandoAnual || !historialAnual ? (
        <p>Cargando...</p>
      ) : historialAnual.anios.length === 0 ? (
        <p>Todavía no hay ventas pagadas registradas.</p>
      ) : (
        <>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Año</th>
                  <th>Cant. ventas</th>
                  <th>Ingreso total</th>
                  <th>Ganancia total</th>
                </tr>
              </thead>
              <tbody>
                {historialAnual.anios.map((a) => (
                  <tr key={a.anio}>
                    <td>{a.anio}</td>
                    <td>{a.cantidadVentas}</td>
                    <td>Bs {a.ingresoTotal.toFixed(2)}</td>
                    <td>
                      <strong style={{ color: 'var(--color-success)' }}>Bs {a.gananciaTotal.toFixed(2)}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="saag-stat-grid" style={{ marginTop: 16 }}>
            <div className="saag-stat-card">
              <p className="saag-stat-label">Total de ventas</p>
              <p className="saag-stat-valor">{historialAnual.totalGeneral.cantidadVentas}</p>
            </div>
            <div className="saag-stat-card">
              <p className="saag-stat-label">Ingreso total</p>
              <p className="saag-stat-valor">Bs {historialAnual.totalGeneral.ingresoTotal.toFixed(2)}</p>
            </div>
            <div className="saag-stat-card destacada">
              <p className="saag-stat-label">Ganancia total acumulada</p>
              <p className="saag-stat-valor">Bs {historialAnual.totalGeneral.gananciaTotal.toFixed(2)}</p>
            </div>
          </div>
        </>
      )}

      {ventaDetalle && <ModalDetalleGanancia venta={ventaDetalle} onCerrar={() => setVentaDetalle(null)} />}
    </div>
  );
}
