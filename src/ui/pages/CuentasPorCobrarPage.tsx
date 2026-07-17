import { useMemo, useState } from 'react';
import { obtenerUsuarioActual } from '../../application/auth/useAuth';
import { useDeudas } from '../../application/venta/useDeudas';
import { Venta } from '../../domain/venta/venta.entity';
import { TablaDeudas } from '../components/TablaDeudas';
import { ModalPagarVenta } from '../components/ModalPagarVenta';
import { ModalReportarVenta } from '../components/ModalReportarVenta';
import { ModalDetalleVenta } from '../components/ModalDetalleVenta';

export function CuentasPorCobrarPage() {
  const usuario = obtenerUsuarioActual();
  const esAdmin = usuario?.rol === 'ADMIN';
  const [search, setSearch] = useState('');
  const [orden, setOrden] = useState<'antigua' | 'reciente'>('antigua');

  const { hoy, delMes, montoHoy, montoDelMes, cargando, pagar, reportar } = useDeudas(search || undefined);

  const delMesOrdenado = useMemo(() => {
    const copia = [...delMes];
    copia.sort((a, b) => {
      const diff = new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
      return orden === 'antigua' ? diff : -diff;
    });
    return copia;
  }, [delMes, orden]);

  const [ventaAPagar, setVentaAPagar] = useState<Venta | null>(null);
  const [ventaAReportar, setVentaAReportar] = useState<Venta | null>(null);
  const [ventaDetalle, setVentaDetalle] = useState<Venta | null>(null);

  return (
    <div>
      <div className="page-header">
        <h1>Cuentas por cobrar</h1>
      </div>

      <input
        className="input"
        placeholder="Buscar por nombre, apellido, CI o celular..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: '100%', maxWidth: 420, marginBottom: 24 }}
      />

      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <>
          <div style={{ marginBottom: 32 }}>
            <div className="page-header" style={{ marginBottom: 10 }}>
              <h3 style={{ margin: 0 }}>Hoy</h3>
              <span style={{ fontWeight: 700, color: 'var(--color-danger)' }}>Bs {montoHoy.toFixed(2)} pendiente</span>
            </div>
            <TablaDeudas
              ventas={hoy}
              mostrarUbicacion={esAdmin}
              onVerDetalle={setVentaDetalle}
              onPagar={setVentaAPagar}
              onReportar={setVentaAReportar}
            />
          </div>

          <div>
            <div className="page-header" style={{ marginBottom: 10, flexWrap: 'wrap', gap: 10 }}>
              <h3 style={{ margin: 0 }}>Del mes</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontWeight: 700, color: 'var(--color-danger)' }}>Bs {montoDelMes.toFixed(2)} pendiente</span>
                <select className="input" value={orden} onChange={(e) => setOrden(e.target.value as 'antigua' | 'reciente')}>
                  <option value="antigua">Más antigua primero</option>
                  <option value="reciente">Más reciente primero</option>
                </select>
              </div>
            </div>
            <TablaDeudas
              ventas={delMesOrdenado}
              mostrarUbicacion={esAdmin}
              onVerDetalle={setVentaDetalle}
              onPagar={setVentaAPagar}
              onReportar={setVentaAReportar}
            />
          </div>
        </>
      )}

      {ventaDetalle && <ModalDetalleVenta venta={ventaDetalle} onCerrar={() => setVentaDetalle(null)} />}

      {ventaAPagar && (
        <ModalPagarVenta
          venta={ventaAPagar}
          onCancelar={() => setVentaAPagar(null)}
          onConfirmar={async (efectivo) => {
            await pagar(ventaAPagar.id, efectivo);
            setVentaAPagar(null);
          }}
        />
      )}

      {ventaAReportar && (
        <ModalReportarVenta
          venta={ventaAReportar}
          onCancelar={() => setVentaAReportar(null)}
          onConfirmar={async (mensaje) => {
            await reportar(ventaAReportar.id, mensaje);
            setVentaAReportar(null);
          }}
        />
      )}
    </div>
  );
}
