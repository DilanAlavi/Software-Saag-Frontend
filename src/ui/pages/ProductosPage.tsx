import { useMemo, useState } from 'react';
import { useProductos } from '../../application/producto/useProductos';
import { obtenerUsuarioActual } from '../../application/auth/useAuth';
import { ETIQUETAS_TIPO_PRODUCTO, Producto } from '../../domain/producto/producto.entity';
import { TablaProductos } from '../components/TablaProductos';
import { ModalConfirmacion } from '../components/ModalConfirmacion';
import { FormularioProducto } from '../components/FormularioProducto';

export function ProductosPage() {
  const [search, setSearch] = useState('');
  const [tipoProducto, setTipoProducto] = useState('');
  const usuarioActual = obtenerUsuarioActual();
  const puedeGestionar = usuarioActual?.rol === 'ADMIN' || usuarioActual?.rol === 'ADMIN_SUCURSAL';

  const filtros = useMemo(
    () => ({ search: search || undefined, tipoProducto: tipoProducto || undefined }),
    [search, tipoProducto],
  );
  const { productos, cargando, crear, actualizar, eliminar } = useProductos(filtros);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null);
  const [confirmacion, setConfirmacion] = useState<{ id: number; nombre: string } | null>(null);

  return (
    <div>
      <div className="page-header">
        <h1>Productos</h1>
        {puedeGestionar && (
          <button className="btn btn-primary" onClick={() => setMostrarFormulario(true)}>
            Agregar nuevo producto
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          className="input"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200 }}
        />
        <select className="input" value={tipoProducto} onChange={(e) => setTipoProducto(e.target.value)} style={{ maxWidth: 220 }}>
          <option value="">Todos los tipos</option>
          {Object.entries(ETIQUETAS_TIPO_PRODUCTO).map(([valor, etiqueta]) => (
            <option key={valor} value={valor}>
              {etiqueta}
            </option>
          ))}
        </select>
      </div>

      {cargando ? (
        <p>Cargando...</p>
      ) : productos.length === 0 ? (
        <p>No hay productos que coincidan con la búsqueda.</p>
      ) : (
        <TablaProductos
          productos={productos}
          puedeGestionar={puedeGestionar}
          onSolicitarEditar={(producto) => setProductoEditando(producto)}
          onSolicitarEliminar={(id, nombre) => setConfirmacion({ id, nombre })}
        />
      )}

      <ModalConfirmacion
        visible={confirmacion !== null}
        mensaje={confirmacion ? `¿Quieres eliminar el producto "${confirmacion.nombre}"?` : ''}
        onAceptar={async () => {
          if (confirmacion) {
            await eliminar(confirmacion.id);
          }
          setConfirmacion(null);
        }}
        onCancelar={() => setConfirmacion(null)}
      />

      {mostrarFormulario && (
        <FormularioProducto
          onCancelar={() => setMostrarFormulario(false)}
          onGuardar={async (dto) => {
            await crear(dto);
            setMostrarFormulario(false);
          }}
        />
      )}

      {productoEditando && (
        <FormularioProducto
          productoInicial={productoEditando}
          onCancelar={() => setProductoEditando(null)}
          onGuardar={async (dto) => {
            await actualizar(productoEditando.id, dto);
            setProductoEditando(null);
          }}
        />
      )}
    </div>
  );
}
