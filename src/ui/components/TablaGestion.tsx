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
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Sucursal</th>
            <th>Registrado</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((f) => (
            <tr key={f.id}>
              <td style={{ fontWeight: 700 }}>{f.nombreCompleto}</td>
              <td>{f.categoriaEtiqueta}</td>
              <td>{f.sucursalEtiqueta}</td>
              <td>{f.fechaRegistro ? new Date(f.fechaRegistro).toLocaleString() : '—'}</td>
              <td>
                <span className={f.estado ? 'badge badge-success' : 'badge badge-danger'}>{f.estado ? 'Activo' : 'Inactivo'}</span>
              </td>
              <td>
                <button
                  className={f.estado ? 'btn btn-danger btn-sm' : 'btn btn-accent btn-sm'}
                  onClick={() => onSolicitarCambioEstado(f.id, f.nombreCompleto, f.estado)}
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
