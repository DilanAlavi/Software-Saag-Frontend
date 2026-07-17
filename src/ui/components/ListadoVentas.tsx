import { ReactNode, useMemo, useState } from 'react';
import { useVentas } from '../../application/venta/useVentas';
import { useSucursales } from '../../application/sucursal/useSucursales';
import { ETIQUETAS_ESTADO_VENTA, Venta } from '../../domain/venta/venta.entity';
import { TablaVentas } from './TablaVentas';
import { ModalPagarVenta } from './ModalPagarVenta';
import { ModalCancelarVenta } from './ModalCancelarVenta';
import { ModalEntregarVenta } from './ModalEntregarVenta';
import { ModalDetalleVenta } from './ModalDetalleVenta';
import { ModalReportarVenta } from './ModalReportarVenta';

const PAGE_SIZE = 10;

interface Props {
  titulo: string;
  fechaFija?: string;
  accionExtra?: ReactNode;
  mensajeVacio?: string;
}

export function ListadoVentas({ titulo, fechaFija, accionExtra, mensajeVacio }: Props) {
  const [estado, setEstado] = useState('');
  const [sucursalId, setSucursalId] = useState('');
  const [fecha, setFecha] = useState('');
  const [search, setSearch] = useState('');
  const [searchTipo, setSearchTipo] = useState<'cliente' | 'vendedor'>('cliente');
  const [page, setPage] = useState(1);
  const { sucursales } = useSucursales();

  const filtros = useMemo(
    () => ({
      estado: estado || undefined,
      sucursalId: sucursalId ? Number(sucursalId) : undefined,
      fecha: fechaFija ?? (fecha || undefined),
      search: search || undefined,
      searchTipo,
      page,
      pageSize: PAGE_SIZE,
    }),
    [estado, sucursalId, fecha, fechaFija, search, searchTipo, page],
  );
  const { ventas, total, cargando, pagar, cancelar, entregar, reportar, descargarProforma } = useVentas(filtros);

  const [ventaAPagar, setVentaAPagar] = useState<Venta | null>(null);
  const [ventaACancelar, setVentaACancelar] = useState<Venta | null>(null);
  const [ventaAEntregar, setVentaAEntregar] = useState<Venta | null>(null);
  const [ventaAReportar, setVentaAReportar] = useState<Venta | null>(null);
  const [ventaDetalle, setVentaDetalle] = useState<Venta | null>(null);

  const totalPaginas = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const cambiarFiltro = <T,>(setter: (v: T) => void) => (valor: T) => {
    setter(valor);
    setPage(1);
  };

  return (
    <div>
      <div className="page-header">
        <h1>{titulo}</h1>
        {accionExtra}
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <select
          className="input"
          value={searchTipo}
          onChange={(e) => cambiarFiltro(setSearchTipo)(e.target.value as 'cliente' | 'vendedor')}
          style={{ maxWidth: 140 }}
        >
          <option value="cliente">Cliente</option>
          <option value="vendedor">Vendedor</option>
        </select>
        <input
          className="input"
          placeholder={searchTipo === 'vendedor' ? 'Buscar por nombre o usuario del vendedor...' : 'Buscar por nombre, apellido, CI o celular...'}
          value={search}
          onChange={(e) => cambiarFiltro(setSearch)(e.target.value)}
          style={{ flex: 1, minWidth: 220 }}
        />
        <select className="input" value={estado} onChange={(e) => cambiarFiltro(setEstado)(e.target.value)} style={{ maxWidth: 200 }}>
          <option value="">Todos los estados</option>
          {Object.entries(ETIQUETAS_ESTADO_VENTA).map(([valor, etiqueta]) => (
            <option key={valor} value={valor}>
              {etiqueta}
            </option>
          ))}
        </select>
        <select
          className="input"
          value={sucursalId}
          onChange={(e) => cambiarFiltro(setSucursalId)(e.target.value)}
          style={{ maxWidth: 200 }}
        >
          <option value="">Todas las sucursales</option>
          {sucursales.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nombre}
            </option>
          ))}
        </select>
        {!fechaFija && (
          <input
            className="input"
            type="date"
            value={fecha}
            onChange={(e) => cambiarFiltro(setFecha)(e.target.value)}
            style={{ maxWidth: 170 }}
          />
        )}
      </div>

      {cargando ? (
        <p>Cargando...</p>
      ) : ventas.length === 0 ? (
        <p>{mensajeVacio ?? 'No hay ventas que coincidan con la búsqueda.'}</p>
      ) : (
        <>
          <TablaVentas
            ventas={ventas}
            onVerDetalle={setVentaDetalle}
            onPagar={setVentaAPagar}
            onCancelar={setVentaACancelar}
            onEntregar={setVentaAEntregar}
            onReportar={setVentaAReportar}
            onDescargarProforma={descargarProforma}
          />

          {totalPaginas > 1 && (
            <div style={{ display: 'flex', gap: 6, marginTop: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: 'var(--color-text-muted)', marginRight: 8 }}>
                {total} venta{total === 1 ? '' : 's'} en total
              </span>
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  className={n === page ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          )}
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

      {ventaACancelar && (
        <ModalCancelarVenta
          venta={ventaACancelar}
          onCancelar={() => setVentaACancelar(null)}
          onConfirmar={async (motivo) => {
            await cancelar(ventaACancelar.id, motivo);
            setVentaACancelar(null);
          }}
        />
      )}

      {ventaAEntregar && (
        <ModalEntregarVenta
          venta={ventaAEntregar}
          onCancelar={() => setVentaAEntregar(null)}
          onConfirmar={async (detalleIds) => {
            await entregar(ventaAEntregar.id, detalleIds);
            setVentaAEntregar(null);
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
