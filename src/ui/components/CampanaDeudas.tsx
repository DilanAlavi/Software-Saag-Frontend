import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeudas } from '../../application/venta/useDeudas';

export function CampanaDeudas() {
  const [abierto, setAbierto] = useState(false);
  const { hoy, total, montoTotal, cargando } = useDeudas();
  const navigate = useNavigate();

  const irATodas = () => {
    setAbierto(false);
    navigate('/panel/cuentas-por-cobrar');
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setAbierto((v) => !v)}
        aria-label="Cuentas por cobrar"
        style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: 20,
          color: 'inherit',
          padding: 4,
        }}
      >
        🔔
        {!cargando && total > 0 && (
          <span
            style={{
              position: 'absolute',
              top: -2,
              right: -4,
              background: 'var(--color-danger)',
              color: '#fff',
              borderRadius: '999px',
              fontSize: 11,
              fontWeight: 700,
              padding: '1px 6px',
              lineHeight: 1.4,
            }}
          >
            {total}
          </span>
        )}
      </button>

      {abierto && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setAbierto(false)} />
          <div
            className="card"
            style={{
              position: 'absolute',
              right: 0,
              top: '120%',
              width: 320,
              maxWidth: '90vw',
              zIndex: 50,
              padding: 16,
            }}
          >
            <h3 style={{ margin: '0 0 8px', color: 'var(--color-danger)' }}>Cuentas por cobrar</h3>
            {total === 0 ? (
              <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text-muted)' }}>No hay deudas pendientes.</p>
            ) : (
              <>
                <p style={{ margin: '0 0 10px', fontSize: 13, color: 'var(--color-text-muted)' }}>
                  Bs {montoTotal.toFixed(2)} pendientes en total este mes
                </p>
                <div style={{ fontSize: 13, fontWeight: 700, margin: '0 0 6px' }}>Hoy ({hoy.length})</div>
                {hoy.length === 0 ? (
                  <p style={{ margin: '0 0 10px', fontSize: 13, color: 'var(--color-text-muted)' }}>Nada pendiente hoy.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                    {hoy.slice(0, 5).map((v) => (
                      <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                        <span>
                          {v.cliente.nombre} {v.cliente.apellidoPaterno}
                        </span>
                        <span style={{ fontWeight: 700 }}>Bs {v.total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            <button className="btn btn-primary btn-sm" style={{ width: '100%' }} onClick={irATodas}>
              Ver todas
            </button>
          </div>
        </>
      )}
    </div>
  );
}
