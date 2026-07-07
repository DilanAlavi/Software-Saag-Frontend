import { FormEvent, useState } from 'react';
import { useMarcas } from '../../application/marca/useMarcas';
import { ModalConfirmacion } from '../components/ModalConfirmacion';

export function MarcasPage() {
  const { marcas, cargando, crear, eliminar } = useMarcas();
  const [nombre, setNombre] = useState('');
  const [confirmacion, setConfirmacion] = useState<{ id: number; nombre: string } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    await crear(nombre.trim());
    setNombre('');
  };

  return (
    <div>
      <h1>Marcas</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, marginBottom: 20, maxWidth: 420 }}>
        <input
          placeholder="Nombre de la marca"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
        <button
          type="submit"
          style={{ background: '#1a1a1a', color: '#faf6ef', border: 'none', padding: '8px 16px', borderRadius: 6, cursor: 'pointer' }}
        >
          Agregar
        </button>
      </form>

      {cargando ? (
        <p>Cargando...</p>
      ) : marcas.length === 0 ? (
        <p>No hay marcas registradas todavía.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', maxWidth: 480, borderCollapse: 'collapse', background: '#fff' }}>
            <thead>
              <tr style={{ background: '#1a1a1a', color: '#faf6ef', textAlign: 'left' }}>
                <th style={{ padding: '10px 14px' }}>Nombre</th>
                <th style={{ padding: '10px 14px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {marcas.map((m) => (
                <tr key={m.id} style={{ borderBottom: '1px solid #e8e0d3' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 700 }}>{m.nombre}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <button
                      onClick={() => setConfirmacion({ id: m.id, nombre: m.nombre })}
                      style={{ background: '#a01a1a', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer' }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ModalConfirmacion
        visible={confirmacion !== null}
        mensaje={confirmacion ? `¿Quieres eliminar la marca "${confirmacion.nombre}"?` : ''}
        onAceptar={async () => {
          if (confirmacion) await eliminar(confirmacion.id);
          setConfirmacion(null);
        }}
        onCancelar={() => setConfirmacion(null)}
      />
    </div>
  );
}
