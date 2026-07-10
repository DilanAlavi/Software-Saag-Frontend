import { useMemo, useState } from 'react';
import { useClientes } from '../../application/cliente/useClientes';
import { useGruposPrecioEspecial } from '../../application/grupo-precio-especial/useGruposPrecioEspecial';
import { grupoPrecioEspecialApiRepository } from '../../infrastructure/api/grupo-precio-especial.api';
import { Cliente, ETIQUETAS_ROL_CLIENTE } from '../../domain/cliente/cliente.entity';
import { ModalConfirmacion } from '../components/ModalConfirmacion';
import { FormularioCliente, DatosCliente } from '../components/FormularioCliente';
import { ModalDetalleCliente } from '../components/ModalDetalleCliente';

export function ClientesPage() {
  const [search, setSearch] = useState('');
  const [rol, setRol] = useState('');

  const filtros = useMemo(() => ({ search: search || undefined, rol: rol || undefined }), [search, rol]);
  const { clientes, cargando, cambiarEstado, crear, actualizar, recargar } = useClientes(filtros);
  const { grupos: gruposDisponibles } = useGruposPrecioEspecial();

  const [confirmacion, setConfirmacion] = useState<{ id: number; nombre: string; estadoActual: boolean } | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [clienteDetalle, setClienteDetalle] = useState<Cliente | null>(null);

  const guardarClienteConGrupos = async (dto: DatosCliente, clienteId?: number) => {
    const { grupoIds, ...datos } = dto;
    const cliente = clienteId ? await actualizar(clienteId, datos) : await crear(datos);
    const idsActuales = cliente.grupos.map((g) => g.id);
    const aAgregar = grupoIds.filter((id) => !idsActuales.includes(id));
    const aQuitar = idsActuales.filter((id) => !grupoIds.includes(id));
    if (aAgregar.length > 0 || aQuitar.length > 0) {
      await Promise.all([
        ...aAgregar.map((id) => grupoPrecioEspecialApiRepository.agregarCliente(id, cliente.id)),
        ...aQuitar.map((id) => grupoPrecioEspecialApiRepository.quitarCliente(id, cliente.id)),
      ]);
      await recargar();
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Clientes</h1>
        <button className="btn btn-primary" onClick={() => setMostrarFormulario(true)}>
          Agregar nuevo cliente
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          className="input"
          placeholder="Buscar cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200 }}
        />
        <select className="input" value={rol} onChange={(e) => setRol(e.target.value)} style={{ maxWidth: 220 }}>
          <option value="">Todos los grupos</option>
          {Object.entries(ETIQUETAS_ROL_CLIENTE).map(([valor, etiqueta]) => (
            <option key={valor} value={valor}>
              {etiqueta}
            </option>
          ))}
        </select>
      </div>

      {cargando ? (
        <p>Cargando...</p>
      ) : clientes.length === 0 ? (
        <p>No hay clientes que coincidan con la búsqueda.</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Roles especiales</th>
                <th>Registrado</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 700 }}>
                    {c.nombre} {c.apellidoPaterno}
                  </td>
                  <td>{ETIQUETAS_ROL_CLIENTE[c.rol] ?? c.rol}</td>
                  <td>
                    {c.grupos.length === 0 ? (
                      <span style={{ color: 'var(--color-text-muted)' }}>—</span>
                    ) : (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {c.grupos.map((g) => (
                          <span key={g.id} className="badge badge-neutral">
                            {g.nombre}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td>{c.fechaRegistro ? new Date(c.fechaRegistro).toLocaleString() : '—'}</td>
                  <td>
                    <span className={c.estado ? 'badge badge-success' : 'badge badge-danger'}>{c.estado ? 'Activo' : 'Inactivo'}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => setClienteDetalle(c)}>
                        Ver detalle
                      </button>
                      <button className="btn btn-primary btn-sm" onClick={() => setClienteEditando(c)}>
                        Editar
                      </button>
                      <button
                        className={c.estado ? 'btn btn-danger btn-sm' : 'btn btn-accent btn-sm'}
                        onClick={() => setConfirmacion({ id: c.id, nombre: `${c.nombre} ${c.apellidoPaterno}`, estadoActual: c.estado })}
                      >
                        {c.estado ? 'Desactivar' : 'Activar'}
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
        mensaje={
          confirmacion
            ? `¿Quieres poner ${confirmacion.estadoActual ? 'inactivo' : 'activo'} a ${confirmacion.nombre}?`
            : ''
        }
        onAceptar={async () => {
          if (confirmacion) {
            await cambiarEstado(confirmacion.id, !confirmacion.estadoActual);
          }
          setConfirmacion(null);
        }}
        onCancelar={() => setConfirmacion(null)}
      />

      {clienteDetalle && <ModalDetalleCliente cliente={clienteDetalle} onCerrar={() => setClienteDetalle(null)} />}

      {mostrarFormulario && (
        <FormularioCliente
          gruposDisponibles={gruposDisponibles}
          onCancelar={() => setMostrarFormulario(false)}
          onGuardar={async (dto) => {
            await guardarClienteConGrupos(dto);
            setMostrarFormulario(false);
          }}
        />
      )}

      {clienteEditando && (
        <FormularioCliente
          clienteInicial={clienteEditando}
          gruposDisponibles={gruposDisponibles}
          onCancelar={() => setClienteEditando(null)}
          onGuardar={async (dto) => {
            await guardarClienteConGrupos(dto, clienteEditando.id);
            setClienteEditando(null);
          }}
        />
      )}
    </div>
  );
}
