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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <h1 style={{ margin: 0 }}>Precios</h1>
        <ImportarExcelProductos onImportado={recargar} />
      </div>

      {cargando ? (
        <p>Cargando...</p>
      ) : filas.length === 0 ? (
        <p>No hay productos registrados todavía.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
            <thead>
              <tr style={{ background: '#1a1a1a', color: '#faf6ef', textAlign: 'left' }}>
                <th style={th}>Nombre</th>
                <th style={th}>Tipo</th>
                <th style={th}>Base</th>
                <th style={th}>Standard 1</th>
                <th style={th}>Standard 2</th>
                <th style={th}>Mayor 1</th>
                <th style={th}>Mayor 2</th>
                <th style={th}>Plomería</th>
                <th style={th}>Carpintería</th>
                <th style={th}>Electricista</th>
                <th style={th}>Caja</th>
                <th style={th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((fila) => (
                <tr key={fila.productoId} style={{ borderBottom: '1px solid #e8e0d3' }}>
                  <td style={{ ...td, fontWeight: 700 }}>{fila.nombre}</td>
                  <td style={td}>{ETIQUETAS_TIPO_PRODUCTO[fila.tipoProducto as keyof typeof ETIQUETAS_TIPO_PRODUCTO] ?? fila.tipoProducto}</td>
                  <td style={td}>{formatear(fila.precio?.precioCosto)}</td>
                  <td style={td}>{formatear(fila.precio?.menor1)}</td>
                  <td style={td}>{formatear(fila.precio?.menor2)}</td>
                  <td style={td}>{formatear(fila.precio?.mayor1)}</td>
                  <td style={td}>{formatear(fila.precio?.mayor2)}</td>
                  <td style={td}>{formatear(fila.precio?.plomeria)}</td>
                  <td style={td}>{formatear(fila.precio?.carpinteria)}</td>
                  <td style={td}>{formatear(fila.precio?.electricista)}</td>
                  <td style={td}>{formatear(fila.precio?.precioCaja)}</td>
                  <td style={td}>
                    <button
                      onClick={() => setEditando(fila)}
                      style={{ background: '#1a1a1a', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer' }}
                    >
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

const th = { padding: '10px 14px', fontSize: 13, textTransform: 'uppercase' as const, letterSpacing: 0.5 };
const td = { padding: '10px 14px', fontSize: 14, color: '#1a1a1a' };
