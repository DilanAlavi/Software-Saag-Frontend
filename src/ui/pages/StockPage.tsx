import { useMemo, useState } from 'react';
import { useStock } from '../../application/stock/useStock';
import { useProductos } from '../../application/producto/useProductos';
import { useSucursales } from '../../application/sucursal/useSucursales';
import { obtenerUsuarioActual } from '../../application/auth/useAuth';
import { StockConDetalle } from '../../domain/stock/stock.entity';
import { FormularioStock } from '../components/FormularioStock';
import { FormularioConfirmarStock } from '../components/FormularioConfirmarStock';

function formatearDesglose(fila: StockConDetalle): string {
  if (fila.unidadesTotales === null) return 'Sin contar';
  const partes: string[] = [];
  if (fila.cajas !== null) partes.push(`${fila.cajas} caja${fila.cajas === 1 ? '' : 's'}`);
  if (fila.paquetes !== null) partes.push(`${fila.paquetes} paquete${fila.paquetes === 1 ? '' : 's'}`);
  if (fila.piezasSueltas !== null) partes.push(`${fila.piezasSueltas} pieza${fila.piezasSueltas === 1 ? '' : 's'}`);
  return `${partes.join(', ')} (${fila.unidadesTotales} u.)`;
}

export function StockPage() {
  const { filas, cargando, guardar, confirmar } = useStock();
  const filtrosProductos = useMemo(() => ({}), []);
  const { productos } = useProductos(filtrosProductos);
  const { sucursales } = useSucursales();
  const usuarioActual = obtenerUsuarioActual();
  const puedeGestionar = usuarioActual?.rol === 'ADMIN' || usuarioActual?.rol === 'ADMIN_SUCURSAL';

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState<StockConDetalle | null>(null);
  const [confirmando, setConfirmando] = useState<StockConDetalle | null>(null);

  return (
    <div>
      <div className="page-header">
        <h1>Stock</h1>
        {puedeGestionar && (
          <button className="btn btn-primary" onClick={() => setMostrarFormulario(true)}>
            Agregar stock
          </button>
        )}
      </div>

      {cargando ? (
        <p>Cargando...</p>
      ) : filas.length === 0 ? (
        <p>No hay stock cargado todavía.</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Código</th>
                <th>Ubicación</th>
                <th>Área</th>
                <th>Stock</th>
                <th>Confirmado</th>
                <th>Vendidas</th>
                {puedeGestionar && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {filas.map((fila) => (
                <tr key={fila.id}>
                  <td style={{ fontWeight: 700 }}>{fila.productoNombre}</td>
                  <td>{fila.productoCodigo ?? '—'}</td>
                  <td>{fila.sucursalNombre}</td>
                  <td>{fila.area ?? '—'}</td>
                  <td>{formatearDesglose(fila)}</td>
                  <td>
                    <span className={fila.confirmado ? 'badge badge-success' : 'badge badge-neutral'}>
                      {fila.confirmado ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td>{fila.cantidadVendidaAcumulada}</td>
                  {puedeGestionar && (
                    <td>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <button className="btn btn-primary btn-sm" onClick={() => setEditando(fila)}>
                          Agregar más
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setConfirmando(fila)}>
                          Confirmar
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {mostrarFormulario && (
        <FormularioStock
          productos={productos}
          sucursales={sucursales}
          onCancelar={() => setMostrarFormulario(false)}
          onGuardar={async (dto) => {
            await guardar(dto);
            setMostrarFormulario(false);
          }}
        />
      )}

      {editando && (
        <FormularioStock
          filaInicial={editando}
          productos={productos}
          sucursales={sucursales}
          onCancelar={() => setEditando(null)}
          onGuardar={async (dto) => {
            await guardar({ ...dto, productoId: editando.productoId, sucursalId: editando.sucursalId });
            setEditando(null);
          }}
        />
      )}

      {confirmando && (
        <FormularioConfirmarStock
          fila={confirmando}
          onCancelar={() => setConfirmando(null)}
          onConfirmar={async (cantidad) => {
            await confirmar({ productoId: confirmando.productoId, sucursalId: confirmando.sucursalId, cantidad });
            setConfirmando(null);
          }}
        />
      )}
    </div>
  );
}
