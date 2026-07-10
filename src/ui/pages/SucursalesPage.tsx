import { useState } from 'react';
import { useSucursales } from '../../application/sucursal/useSucursales';
import { obtenerUsuarioActual } from '../../application/auth/useAuth';
import { ETIQUETAS_MODALIDAD_VENTA, ETIQUETAS_TIPO_UBICACION, Sucursal } from '../../domain/sucursal/sucursal.entity';
import { ModalConfirmacion } from '../components/ModalConfirmacion';
import { FormularioSucursal } from '../components/FormularioSucursal';

export function SucursalesPage() {
  const { sucursales, cargando, crear, actualizar, cambiarEstado } = useSucursales();
  const usuarioActual = obtenerUsuarioActual();
  const puedeGestionar = usuarioActual?.rol === 'ADMIN';

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState<Sucursal | null>(null);
  const [confirmacion, setConfirmacion] = useState<{ id: number; nombre: string; estadoActual: boolean } | null>(null);

  return (
    <div>
      <div className="page-header">
        <h1>Sucursales</h1>
        {puedeGestionar && (
          <button className="btn btn-primary" onClick={() => setMostrarFormulario(true)}>
            Agregar nueva sucursal
          </button>
        )}
      </div>

      {cargando ? (
        <p>Cargando...</p>
      ) : sucursales.length === 0 ? (
        <p>No hay sucursales registradas todavía.</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Ciudad</th>
                <th>Zona</th>
                <th>Modalidad venta</th>
                <th>Estado</th>
                {puedeGestionar && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {sucursales.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 700 }}>{s.nombre}</td>
                  <td>{ETIQUETAS_TIPO_UBICACION[s.tipo]}</td>
                  <td>{s.ciudad ?? '—'}</td>
                  <td>{s.zona ?? '—'}</td>
                  <td>{s.modalidadVentaPaquete ? ETIQUETAS_MODALIDAD_VENTA[s.modalidadVentaPaquete] : '—'}</td>
                  <td>
                    <span className={s.estado ? 'badge badge-success' : 'badge badge-danger'}>
                      {s.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  {puedeGestionar && (
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-primary btn-sm" onClick={() => setEditando(s)}>
                          Editar
                        </button>
                        <button
                          className={s.estado ? 'btn btn-danger btn-sm' : 'btn btn-accent btn-sm'}
                          onClick={() => setConfirmacion({ id: s.id, nombre: s.nombre, estadoActual: s.estado })}
                        >
                          {s.estado ? 'Desactivar' : 'Activar'}
                        </button>
                      </div>
                    </td>
                  )}
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
            ? `¿Quieres poner ${confirmacion.estadoActual ? 'inactiva' : 'activa'} la sucursal "${confirmacion.nombre}"?`
            : ''
        }
        onAceptar={async () => {
          if (confirmacion) await cambiarEstado(confirmacion.id, !confirmacion.estadoActual);
          setConfirmacion(null);
        }}
        onCancelar={() => setConfirmacion(null)}
      />

      {mostrarFormulario && (
        <FormularioSucursal
          onCancelar={() => setMostrarFormulario(false)}
          onGuardar={async (dto) => {
            await crear(dto);
            setMostrarFormulario(false);
          }}
        />
      )}

      {editando && (
        <FormularioSucursal
          sucursalInicial={editando}
          onCancelar={() => setEditando(null)}
          onGuardar={async (dto) => {
            await actualizar(editando.id, dto);
            setEditando(null);
          }}
        />
      )}
    </div>
  );
}
