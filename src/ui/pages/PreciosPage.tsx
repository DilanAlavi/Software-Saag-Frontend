import { useState } from 'react';
import { usePrecios } from '../../application/precio/usePrecios';
import { ProductoConPrecio } from '../../domain/precio/precio.entity';
import { ETIQUETAS_TIPO_PRODUCTO } from '../../domain/producto/producto.entity';
import { FormularioPrecio } from '../components/FormularioPrecio';
import { ImportarExcelProductos } from '../components/ImportarExcelProductos';

function formatear(valor: number | null | undefined) {
  return valor !== null && valor !== undefined ? valor.toFixed(2) : '—';
}

export function PreciosPage() {
  const { filas, cargando, guardar, recargar } = usePrecios();
  const [editando, setEditando] = useState<ProductoConPrecio | null>(null);

  return (
    <div>
      <div className="page-header" style={{ alignItems: 'flex-start' }}>
        <h1>Precios</h1>
        <ImportarExcelProductos onImportado={recargar} />
      </div>

      {cargando ? (
        <p>Cargando...</p>
      ) : filas.length === 0 ? (
        <p>No hay productos registrados todavía.</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Base</th>
                <th>Standard 1</th>
                <th>Standard 2</th>
                <th>Mayor 1</th>
                <th>Mayor 2</th>
                <th>Plomería</th>
                <th>Carpintería</th>
                <th>Electricista</th>
                <th>Caja</th>
                <th>Pieza suelta</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((fila) => (
                <tr key={fila.productoId}>
                  <td style={{ fontWeight: 700 }}>{fila.nombre}</td>
                  <td>{ETIQUETAS_TIPO_PRODUCTO[fila.tipoProducto as keyof typeof ETIQUETAS_TIPO_PRODUCTO] ?? fila.tipoProducto}</td>
                  <td>{formatear(fila.precio?.precioCosto)}</td>
                  <td>{formatear(fila.precio?.menor1)}</td>
                  <td>{formatear(fila.precio?.menor2)}</td>
                  <td>{formatear(fila.precio?.mayor1)}</td>
                  <td>{formatear(fila.precio?.mayor2)}</td>
                  <td>{formatear(fila.precio?.plomeria)}</td>
                  <td>{formatear(fila.precio?.carpinteria)}</td>
                  <td>{formatear(fila.precio?.electricista)}</td>
                  <td>{formatear(fila.precio?.precioCaja)}</td>
                  <td>{formatear(fila.precio?.precioPiezaSuelta)}</td>
                  <td>
                    <button className="btn btn-primary btn-sm" onClick={() => setEditando(fila)}>
                      {fila.precio ? 'Editar' : 'Cargar precios'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editando && (
        <FormularioPrecio
          nombreProducto={editando.nombre}
          precioInicial={editando.precio}
          onCancelar={() => setEditando(null)}
          onGuardar={async (dto) => {
            await guardar(editando.productoId, dto);
            setEditando(null);
          }}
        />
      )}
    </div>
  );
}
