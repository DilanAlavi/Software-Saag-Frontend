import { Producto, ETIQUETAS_TIPO_PRODUCTO } from '../../domain/producto/producto.entity';

interface Props {
  productos: Producto[];
  puedeGestionar: boolean;
  onSolicitarEditar: (producto: Producto) => void;
  onSolicitarEliminar: (id: number, nombre: string) => void;
}

export function TablaProductos({ productos, puedeGestionar, onSolicitarEditar, onSolicitarEliminar }: Props) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
        <thead>
          <tr style={{ background: '#1a1a1a', color: '#faf6ef', textAlign: 'left' }}>
            <th style={th}>Nombre</th>
            <th style={th}>Marca</th>
            <th style={th}>Tipo</th>
            <th style={th}>Código</th>
            {puedeGestionar && <th style={th}>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id} style={{ borderBottom: '1px solid #e8e0d3' }}>
              <td style={{ ...td, fontWeight: 700 }}>{p.nombre}</td>
              <td style={td}>{p.marca ?? '—'}</td>
              <td style={td}>{ETIQUETAS_TIPO_PRODUCTO[p.tipoProducto] ?? p.tipoProducto}</td>
              <td style={td}>{p.codigo ?? '—'}</td>
              {puedeGestionar && (
                <td style={{ ...td, display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => onSolicitarEditar(p)}
                    style={{ background: '#1a1a1a', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer' }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onSolicitarEliminar(p.id, p.nombre)}
                    style={{
                      background: '#a01a1a',
                      color: '#fff',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: 6,
                      cursor: 'pointer',
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = { padding: '10px 14px', fontSize: 13, textTransform: 'uppercase' as const, letterSpacing: 0.5 };
const td = { padding: '10px 14px', fontSize: 14, color: '#1a1a1a' };
