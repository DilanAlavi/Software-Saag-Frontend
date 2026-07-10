import { FormEvent, useState } from 'react';
import { ETIQUETAS_ROL_CLIENTE } from '../../domain/cliente/cliente.entity';
import { GrupoPrecioEspecial } from '../../domain/grupo-precio-especial/grupo-precio-especial.entity';
import './modal.css';

interface Props {
  grupoInicial?: GrupoPrecioEspecial;
  onCancelar: () => void;
  onGuardar: (dto: any) => Promise<void>;
}

export function FormularioGrupoPrecioEspecial({ grupoInicial, onCancelar, onGuardar }: Props) {
  const esEdicion = Boolean(grupoInicial);
  const [nombre, setNombre] = useState(grupoInicial?.nombre ?? '');
  const [categoriaAsignada, setCategoriaAsignada] = useState<string>(grupoInicial?.categoriaAsignada ?? 'MAYOR_1');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await onGuardar({ nombre, categoriaAsignada });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="saag-modal-overlay">
      <form onSubmit={handleSubmit} className="saag-modal-caja">
        <h3 style={{ marginTop: 0 }}>{esEdicion ? 'Editar grupo de precio especial' : 'Nuevo grupo de precio especial'}</h3>

        <input
          className="saag-input-full"
          placeholder="Nombre del grupo (ej. Cintas)"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <select className="saag-input-full" value={categoriaAsignada} onChange={(e) => setCategoriaAsignada(e.target.value)}>
          {Object.entries(ETIQUETAS_ROL_CLIENTE).map(([valor, etiqueta]) => (
            <option key={valor} value={valor}>
              {etiqueta}
            </option>
          ))}
        </select>

        <div className="saag-modal-acciones">
          <button type="button" onClick={onCancelar} className="btn btn-secondary">
            Cancelar
          </button>
          <button type="submit" disabled={enviando} className="btn btn-primary">
            {enviando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Aceptar'}
          </button>
        </div>
      </form>
    </div>
  );
}
