import { Producto, ETIQUETAS_TIPO_PRODUCTO } from '../../domain/producto/producto.entity';

interface Props {
  productos: Producto[];
  puedeGestionar: boolean;
  onSolicitarEliminar: (id: number, nombre: string) => void;
}

export function TablaProductos({ productos, puedeGestionar, onSolicitarEliminar }: Props) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
        <thead>
          <tr style={{ background: '#1a1a1a', color: '#faf6ef', textAlign: 'left' }}>
            <th style={th}>Nombre</th>
            <th style={th}>Marca</th>
            <th style={th}>Tipo</th>
            <th style={th}>Código</th>
            <th style={th}>Cantidad</th>
            <th style={th}>Costo</th>
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
              <td style={td}>{p.cantidad}</td>
              <td style={td}>{p.precioCosto !== null ? p.precioCosto.toFixed(2) : '—'}</td>
              {puedeGestionar && (
                <td style={td}>
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
