import { useMemo, useState } from 'react';
import { useClientes } from '../../application/cliente/useClientes';
import { ETIQUETAS_ROL_CLIENTE } from '../../domain/cliente/cliente.entity';
import { TablaGestion } from '../components/TablaGestion';
import { ModalConfirmacion } from '../components/ModalConfirmacion';

export function ClientesPage() {
  const [search, setSearch] = useState('');
  const [rol, setRol] = useState('');

  const filtros = useMemo(() => ({ search: search || undefined, rol: rol || undefined }), [search, rol]);
  const { clientes, cargando, cambiarEstado } = useClientes(filtros);

  const [confirmacion, setConfirmacion] = useState<{ id: number; nombre: string; estadoActual: boolean } | null>(null);

  const filas = clientes.map((c) => ({
    id: c.id,
    nombreCompleto: `${c.nombre} ${c.apellidoPaterno}`,
    categoriaEtiqueta: ETIQUETAS_ROL_CLIENTE[c.rol] ?? c.rol,
    sucursalEtiqueta: c.sucursal ? c.sucursal.nombre : 'Sin sucursal',
    estado: c.estado,
    fechaRegistro: (c as any).fechaRegistro,
  }));

  return (
    <div>
      <h1>Clientes</h1>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          placeholder="Buscar cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: 8 }}
        />
        <select value={rol} onChange={(e) => setRol(e.target.value)} style={{ padding: 8 }}>
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
      ) : filas.length === 0 ? (
        <p>No hay clientes que coincidan con la búsqueda.</p>
      ) : (
        <TablaGestion
          filas={filas}
          onSolicitarCambioEstado={(id, nombre, estadoActual) => setConfirmacion({ id, nombre, estadoActual })}
        />
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
    </div>
  );
}
