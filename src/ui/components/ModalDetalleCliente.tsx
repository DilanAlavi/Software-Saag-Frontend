import { Cliente, ETIQUETAS_ROL_CLIENTE } from '../../domain/cliente/cliente.entity';
import './modal.css';

interface Props {
  cliente: Cliente;
  onCerrar: () => void;
}

export function ModalDetalleCliente({ cliente, onCerrar }: Props) {
  return (
    <div className="saag-modal-overlay" onClick={onCerrar}>
      <div className="saag-modal-caja" onClick={(e) => e.stopPropagation()}>
        <h3>
          {cliente.nombre} {cliente.apellidoPaterno} {cliente.apellidoMaterno ?? ''}
        </h3>

        <div className="grid-2" style={{ gap: 14 }}>
          <div>
            <p style={etiqueta}>Categoría</p>
            <p style={valor}>{ETIQUETAS_ROL_CLIENTE[cliente.rol]}</p>
          </div>
          <div>
            <p style={etiqueta}>Estado</p>
            <span className={cliente.estado ? 'badge badge-success' : 'badge badge-danger'}>
              {cliente.estado ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          <div>
            <p style={etiqueta}>Celular</p>
            <p style={valor}>{cliente.celular || '—'}</p>
          </div>
          <div>
            <p style={etiqueta}>CI</p>
            <p style={valor}>{cliente.ci || '—'}</p>
          </div>
          <div>
            <p style={etiqueta}>Género</p>
            <p style={valor}>{cliente.genero || '—'}</p>
          </div>
          <div>
            <p style={etiqueta}>Registrado</p>
            <p style={valor}>{cliente.fechaRegistro ? new Date(cliente.fechaRegistro).toLocaleString() : '—'}</p>
          </div>
        </div>

        <div>
          <p style={etiqueta}>Roles especiales</p>
          {cliente.grupos.length === 0 ? (
            <p style={{ ...valor, fontWeight: 400, color: 'var(--color-text-muted)' }}>Ninguno</p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
              {cliente.grupos.map((g) => (
                <span key={g.id} className="badge badge-neutral">
                  {g.nombre}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="saag-modal-acciones">
          <button type="button" className="btn btn-secondary" onClick={onCerrar}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

const etiqueta = { margin: 0, fontSize: 12, color: 'var(--color-text-muted)', textTransform: 'uppercase' as const, letterSpacing: '0.04em' };
const valor = { margin: '2px 0 0', fontSize: 15, fontWeight: 600, color: 'var(--color-text)' };
