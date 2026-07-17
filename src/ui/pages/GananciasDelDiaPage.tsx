import { useState } from 'react';
import { useResumenGananciasDia } from '../../application/ganancia/useGanancias';
import { VentaConGanancia } from '../../domain/ganancia/ganancia.entity';
import { TablaVentasGanancia } from '../components/TablaVentasGanancia';
import { ModalDetalleGanancia } from '../components/ModalDetalleGanancia';

export function GananciasDelDiaPage() {
  const { resumen, ventas, cargando } = useResumenGananciasDia();
  const [ventaDetalle, setVentaDetalle] = useState<VentaConGanancia | null>(null);

  return (
    <div>
      <div className="page-header">
        <h1>Ganancias del día</h1>
      </div>

      {cargando || !resumen ? (
        <p>Cargando...</p>
      ) : (
        <>
          <div className="saag-stat-grid">
            <div className="saag-stat-card">
              <p className="saag-stat-label">Ventas del día</p>
              <p className="saag-stat-valor">{resumen.cantidadVentas}</p>
            </div>
            <div className="saag-stat-card">
              <p className="saag-stat-label">Productos vendidos</p>
              <p className="saag-stat-valor">{resumen.cantidadProductosVendidos}</p>
            </div>
            <div className="saag-stat-card">
              <p className="saag-stat-label">Ingreso del día</p>
              <p className="saag-stat-valor">Bs {resumen.ingresoTotal.toFixed(2)}</p>
            </div>
            <div className="saag-stat-card destacada">
              <p className="saag-stat-label">Ganancia del día</p>
              <p className="saag-stat-valor">Bs {resumen.gananciaTotal.toFixed(2)}</p>
            </div>
          </div>

          {ventas.length === 0 ? (
            <p>Todavía no hay ventas pagadas hoy.</p>
          ) : (
            <TablaVentasGanancia ventas={ventas} onVerDetalle={setVentaDetalle} />
          )}
        </>
      )}

      {ventaDetalle && <ModalDetalleGanancia venta={ventaDetalle} onCerrar={() => setVentaDetalle(null)} />}
    </div>
  );
}
