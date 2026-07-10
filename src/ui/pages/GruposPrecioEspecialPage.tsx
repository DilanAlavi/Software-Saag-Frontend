import { useMemo, useState } from 'react';
import { useGruposPrecioEspecial } from '../../application/grupo-precio-especial/useGruposPrecioEspecial';
import { useProductos } from '../../application/producto/useProductos';
import { useClientes } from '../../application/cliente/useClientes';
import { ETIQUETAS_ROL_CLIENTE } from '../../domain/cliente/cliente.entity';
import { GrupoPrecioEspecial } from '../../domain/grupo-precio-especial/grupo-precio-especial.entity';
import { FormularioGrupoPrecioEspecial } from '../components/FormularioGrupoPrecioEspecial';
import { ModalConfirmacion } from '../components/ModalConfirmacion';
import { ModalProductosDeGrupo } from '../components/ModalProductosDeGrupo';
import { ModalClientesDeGrupo } from '../components/ModalClientesDeGrupo';

export function GruposPrecioEspecialPage() {
  const { grupos, cargando, error, crear, actualizar, agregarProducto, quitarProducto, agregarCliente, quitarCliente, cambiarEstado } =
    useGruposPrecioEspecial();
  const filtrosProductos = useMemo(() => ({}), []);
  const filtrosClientes = useMemo(() => ({}), []);
  const { productos } = useProductos(filtrosProductos);
  const { clientes } = useClientes(filtrosClientes);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [grupoEditando, setGrupoEditando] = useState<GrupoPrecioEspecial | null>(null);
  const [grupoProductos, setGrupoProductos] = useState<GrupoPrecioEspecial | null>(null);
  const [grupoClientes, setGrupoClientes] = useState<GrupoPrecioEspecial | null>(null);
  const [confirmacion, setConfirmacion] = useState<{ id: number; nombre: string } | null>(null);

  // Mantiene la ventana de "ver productos/clientes" sincronizada con los datos frescos tras cada cambio
  const grupoProductosActual = grupoProductos ? grupos.find((g) => g.id === grupoProductos.id) ?? null : null;
  const grupoClientesActual = grupoClientes ? grupos.find((g) => g.id === grupoClientes.id) ?? null : null;

  return (
    <div>
      <div className="page-header">
        <h1>Grupos de Precio Especial</h1>
        <button className="btn btn-primary" onClick={() => setMostrarFormulario(true)}>
          Nuevo grupo
        </button>
      </div>

      {error && (
        <p style={{ color: 'var(--color-danger)', background: 'var(--color-danger-soft)', borderRadius: 8, padding: 10, marginBottom: 12 }}>
          {error}
        </p>
      )}

      {cargando ? (
        <p>Cargando...</p>
      ) : grupos.length === 0 ? (
        <p>No hay grupos creados todavía.</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Productos</th>
                <th>Clientes</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {grupos.map((grupo) => (
                <tr key={grupo.id}>
                  <td style={{ fontWeight: 700 }}>{grupo.nombre}</td>
                  <td>{ETIQUETAS_ROL_CLIENTE[grupo.categoriaAsignada as keyof typeof ETIQUETAS_ROL_CLIENTE] ?? grupo.categoriaAsignada}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{grupo.productos.length}</span>
                      <button className="btn btn-secondary btn-sm" onClick={() => setGrupoProductos(grupo)}>
                        Ver
                      </button>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{grupo.clientes.length}</span>
                      <button className="btn btn-secondary btn-sm" onClick={() => setGrupoClientes(grupo)}>
                        Ver
                      </button>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-primary btn-sm" onClick={() => setGrupoEditando(grupo)}>
                        Editar
                      </button>
                      <button className="btn btn-danger-solid btn-sm" onClick={() => setConfirmacion({ id: grupo.id, nombre: grupo.nombre })}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ModalConfirmacion
        visible={confirmacion !== null}
        mensaje={confirmacion ? `¿Quieres eliminar el grupo "${confirmacion.nombre}"?` : ''}
        onAceptar={async () => {
          if (confirmacion) await cambiarEstado(confirmacion.id, false);
          setConfirmacion(null);
        }}
        onCancelar={() => setConfirmacion(null)}
      />

      {mostrarFormulario && (
        <FormularioGrupoPrecioEspecial
          onCancelar={() => setMostrarFormulario(false)}
          onGuardar={async (dto) => {
            await crear(dto);
            setMostrarFormulario(false);
          }}
        />
      )}

      {grupoEditando && (
        <FormularioGrupoPrecioEspecial
          grupoInicial={grupoEditando}
          onCancelar={() => setGrupoEditando(null)}
          onGuardar={async (dto) => {
            await actualizar(grupoEditando.id, dto);
            setGrupoEditando(null);
          }}
        />
      )}

      {grupoProductosActual && (
        <ModalProductosDeGrupo
          grupo={grupoProductosActual}
          productosDisponibles={productos}
          onAgregar={(productoId) => agregarProducto(grupoProductosActual.id, productoId)}
          onQuitar={(productoId) => quitarProducto(grupoProductosActual.id, productoId)}
          onCerrar={() => setGrupoProductos(null)}
        />
      )}

      {grupoClientesActual && (
        <ModalClientesDeGrupo
          grupo={grupoClientesActual}
          clientesDisponibles={clientes}
          onAgregar={(clienteId) => agregarCliente(grupoClientesActual.id, clienteId)}
          onQuitar={(clienteId) => quitarCliente(grupoClientesActual.id, clienteId)}
          onCerrar={() => setGrupoClientes(null)}
        />
      )}
    </div>
  );
}
