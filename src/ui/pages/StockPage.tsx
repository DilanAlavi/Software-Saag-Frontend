import { useMemo, useState } from 'react';
import { useStock } from '../../application/stock/useStock';
import { useProductos } from '../../application/producto/useProductos';
import { useSucursales } from '../../application/sucursal/useSucursales';
import { obtenerUsuarioActual } from '../../application/auth/useAuth';
import { StockConDetalle } from '../../domain/stock/stock.entity';
import { FormularioStock } from '../components/FormularioStock';

export function StockPage() {
  const { filas, cargando, guardar } = useStock();
  const filtrosProductos = useMemo(() => ({}), []);
  const { productos } = useProductos(filtrosProductos);
  const { sucursales } = useSucursales();
  const usuarioActual = obtenerUsuarioActual();
  const puedeGestionar = usuarioActual?.rol === 'ADMIN' || usuarioActual?.rol === 'ADMIN_SUCURSAL';

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState<StockConDetalle | null>(null);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <h1 style={{ margin: 0 }}>Stock</h1>
        {puedeGestionar && (
          <button
            onClick={() => setMostrarFormulario(true)}
            style={{ background: '#e8e0d3', color: '#1a1a1a', border: '1px solid #cfc3ac', padding: '10px 16px', borderRadius: 6, cursor: 'pointer' }}
          >
            Agregar stock
          </button>
        )}
      </div>

      {cargando ? (
        <p>Cargando...</p>
      ) : filas.length === 0 ? (
        <p>No hay stock cargado todavía.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
            <thead>
              <tr style={{ background: '#1a1a1a', color: '#faf6ef', textAlign: 'left' }}>
                <th style={th}>Producto</th>
                <th style={th}>Código</th>
                <th style={th}>Ubicación</th>
                <th style={th}>Área</th>
                <th style={th}>Cantidad</th>
                {puedeGestionar && <th style={th}>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {filas.map((fila) => (
                <tr key={fila.id} style={{ borderBottom: '1px solid #e8e0d3' }}>
                  <td style={{ ...td, fontWeight: 700 }}>{fila.productoNombre}</td>
                  <td style={td}>{fila.productoCodigo ?? '—'}</td>
                  <td style={td}>{fila.sucursalNombre}</td>
                  <td style={td}>{fila.area ?? '—'}</td>
                  <td style={td}>{fila.cantidad ?? 'Sin contar'}</td>
                  {puedeGestionar && (
                    <td style={td}>
                      <button
                        onClick={() => setEditando(fila)}
                        style={{ background: '#1a1a1a', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer' }}
                      >
                        Editar
                      </button>
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
    </div>
  );
}

const th = { padding: '10px 14px', fontSize: 13, textTransform: 'uppercase' as const, letterSpacing: 0.5 };
const td = { padding: '10px 14px', fontSize: 14, color: '#1a1a1a' };
