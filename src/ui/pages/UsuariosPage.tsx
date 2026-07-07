import { useMemo, useState } from 'react';
import { useUsuarios } from '../../application/usuario/useUsuarios';
import { useSucursales } from '../../application/sucursal/useSucursales';
import { obtenerUsuarioActual } from '../../application/auth/useAuth';
import { TablaGestion } from '../components/TablaGestion';
import { ModalConfirmacion } from '../components/ModalConfirmacion';
import { ModalCredenciales } from '../components/ModalCredenciales';
import { FormularioUsuario } from '../components/FormularioUsuario';

const ETIQUETAS_ROL: Record<string, string> = {
  ADMIN: 'Administrador',
  ADMIN_SUCURSAL: 'Administrador de Sucursal',
  VENDEDOR: 'Vendedor',
};

export function UsuariosPage() {
  const [search, setSearch] = useState('');
  const [sucursalId, setSucursalId] = useState('');
  const { sucursales } = useSucursales();
  const usuarioActual = obtenerUsuarioActual();

  const filtros = useMemo(
    () => ({ search: search || undefined, sucursalId: sucursalId ? Number(sucursalId) : undefined }),
    [search, sucursalId],
  );
  const { usuarios, cargando, cambiarEstado, crear } = useUsuarios(filtros);

  const [confirmacion, setConfirmacion] = useState<{ id: number; nombre: string; estadoActual: boolean } | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [credencialesGeneradas, setCredencialesGeneradas] = useState<{ nombre: string; username: string; password: string } | null>(null);

  const filas = usuarios.map((u) => ({
    id: u.id,
    nombreCompleto: `${u.nombre} ${u.apellidoPaterno}`,
    categoriaEtiqueta: ETIQUETAS_ROL[u.rol] ?? u.rol,
    sucursalEtiqueta: u.sucursal ? u.sucursal.nombre : 'Sin sucursal',
    estado: u.estado,
    fechaRegistro: (u as any).fechaRegistro,
  }));

  const handleCrear = async (dto: any) => {
    const resultado = await crear(dto);
    setMostrarFormulario(false);
    setCredencialesGeneradas({
      nombre: `${resultado.usuario.nombre} ${resultado.usuario.apellidoPaterno}`,
      username: resultado.credenciales.username,
      password: resultado.credenciales.password,
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Usuarios</h1>
        <button
          onClick={() => setMostrarFormulario(true)}
          style={{ background: '#1a1a1a', color: '#faf6ef', border: 'none', padding: '10px 16px', borderRadius: 6, cursor: 'pointer' }}
        >
          Agregar nuevo usuario
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          placeholder="Buscar usuario..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: 8 }}
        />
        <select value={sucursalId} onChange={(e) => setSucursalId(e.target.value)} style={{ padding: 8 }}>
          <option value="">Todas las sucursales</option>
          {sucursales.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nombre}
            </option>
          ))}
        </select>
      </div>

      {cargando ? (
        <p>Cargando...</p>
      ) : filas.length === 0 ? (
        <p>No hay usuarios que coincidan con la búsqueda.</p>
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

      {mostrarFormulario && (
        <FormularioUsuario
          usuarioActual={usuarioActual}
          sucursales={sucursales}
          onCancelar={() => setMostrarFormulario(false)}
          onCrear={handleCrear}
        />
      )}

      {credencialesGeneradas && (
        <ModalCredenciales
          visible
          nombreCompleto={credencialesGeneradas.nombre}
          username={credencialesGeneradas.username}
          password={credencialesGeneradas.password}
          onCerrar={() => setCredencialesGeneradas(null)}
        />
      )}
    </div>
  );
}
