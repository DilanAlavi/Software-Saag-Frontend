interface Fila {
  id: number;
  nombreCompleto: string;
  categoriaEtiqueta: string;
  sucursalEtiqueta: string;
  estado: boolean;
  fechaRegistro?: string;
}

interface Props {
  filas: Fila[];
  onSolicitarCambioEstado: (id: number, nombreCompleto: string, estadoActual: boolean) => void;
}

export function TablaGestion({ filas, onSolicitarCambioEstado }: Props) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
        <thead>
          <tr style={{ background: '#1a1a1a', color: '#faf6ef', textAlign: 'left' }}>
            <th style={th}>Nombre</th>
            <th style={th}>Categoría</th>
            <th style={th}>Sucursal</th>
            <th style={th}>Registrado</th>
            <th style={th}>Estado</th>
            <th style={th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((f) => (
            <tr key={f.id} style={{ borderBottom: '1px solid #e8e0d3' }}>
              <td style={{ ...td, fontWeight: 700 }}>{f.nombreCompleto}</td>
              <td style={td}>{f.categoriaEtiqueta}</td>
              <td style={td}>{f.sucursalEtiqueta}</td>
              <td style={td}>{f.fechaRegistro ? new Date(f.fechaRegistro).toLocaleString() : '—'}</td>
              <td style={{ ...td, color: f.estado ? '#1a7a1a' : '#a01a1a', fontWeight: 600 }}>
                {f.estado ? 'Activo' : 'Inactivo'}
              </td>
              <td style={td}>
                <button
                  onClick={() => onSolicitarCambioEstado(f.id, f.nombreCompleto, f.estado)}
                  style={{
                    background: f.estado ? '#a01a1a' : '#1a7a1a',
                    color: '#fff',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: 6,
                    cursor: 'pointer',
                  }}
                >
                  {f.estado ? 'Desactivar' : 'Activar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = { padding: '10px 14px', fontSize: 13, textTransform: 'uppercase' as const, letterSpacing: 0.5 };
const td = { padding: '10px 14px', fontSize: 14, color: '#1a1a1a' };
