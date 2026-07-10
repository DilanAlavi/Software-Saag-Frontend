import { Producto, ETIQUETAS_TIPO_PRODUCTO } from '../../domain/producto/producto.entity';

interface Props {
  productos: Producto[];
  puedeGestionar: boolean;
  onSolicitarEditar: (producto: Producto) => void;
  onSolicitarEliminar: (id: number, nombre: string) => void;
}

export function TablaProductos({ productos, puedeGestionar, onSolicitarEditar, onSolicitarEliminar }: Props) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Marca</th>
            <th>Tipo</th>
            <th>Código</th>
            {puedeGestionar && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td style={{ fontWeight: 700 }}>{p.nombre}</td>
              <td>{p.marca ?? '—'}</td>
              <td>{ETIQUETAS_TIPO_PRODUCTO[p.tipoProducto] ?? p.tipoProducto}</td>
              <td>{p.codigo ?? '—'}</td>
              {puedeGestionar && (
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-primary btn-sm" onClick={() => onSolicitarEditar(p)}>
                      Editar
                    </button>
                    <button className="btn btn-danger-solid btn-sm" onClick={() => onSolicitarEliminar(p.id, p.nombre)}>
                      Eliminar
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
