import { FormEvent, useState } from 'react';
import { Sucursal } from '../../domain/sucursal/sucursal.entity';
import './modal.css';

interface Props {
  sucursalInicial?: Sucursal;
  onCancelar: () => void;
  onGuardar: (dto: any) => Promise<void>;
}

export function FormularioSucursal({ sucursalInicial, onCancelar, onGuardar }: Props) {
  const esEdicion = Boolean(sucursalInicial);
  const [nombre, setNombre] = useState(sucursalInicial?.nombre ?? '');
  const [tipo, setTipo] = useState<string>(sucursalInicial?.tipo ?? 'SUCURSAL');
  const [departamento, setDepartamento] = useState(sucursalInicial?.departamento ?? '');
  const [ciudad, setCiudad] = useState(sucursalInicial?.ciudad ?? '');
  const [zona, setZona] = useState(sucursalInicial?.zona ?? '');
  const [referencia, setReferencia] = useState(sucursalInicial?.referencia ?? '');
  const [modalidadVentaPaquete, setModalidadVentaPaquete] = useState<string>(
    sucursalInicial?.modalidadVentaPaquete ?? '',
  );
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await onGuardar({
        nombre,
        tipo,
        departamento: departamento || undefined,
        ciudad: ciudad || undefined,
        zona: zona || undefined,
        referencia: referencia || undefined,
        modalidadVentaPaquete: modalidadVentaPaquete || undefined,
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="saag-modal-overlay">
      <form onSubmit={handleSubmit} className="saag-modal-caja">
        <h3 style={{ marginTop: 0 }}>{esEdicion ? 'Editar sucursal' : 'Agregar nueva sucursal'}</h3>

        <input className="saag-input-full" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        <select className="saag-input-full" value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="CENTRAL">Central</option>
          <option value="SUCURSAL">Sucursal</option>
          <option value="DEPOSITO">Depósito</option>
        </select>
        <input
          className="saag-input-full"
          placeholder="Departamento (opcional)"
          value={departamento}
          onChange={(e) => setDepartamento(e.target.value)}
        />
        <input className="saag-input-full" placeholder="Ciudad (opcional)" value={ciudad} onChange={(e) => setCiudad(e.target.value)} />
        <input className="saag-input-full" placeholder="Zona (opcional)" value={zona} onChange={(e) => setZona(e.target.value)} />
        <input
          className="saag-input-full"
          placeholder="Referencia (opcional)"
          value={referencia}
          onChange={(e) => setReferencia(e.target.value)}
        />

        <label style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
          Modalidad de venta para productos por paquete (opcional — solo si esta ubicación se comporta distinto al
          producto)
        </label>
        <select
          className="saag-input-full"
          value={modalidadVentaPaquete}
          onChange={(e) => setModalidadVentaPaquete(e.target.value)}
        >
          <option value="">Usar el valor por defecto del producto</option>
          <option value="PIEZA">Solo pieza suelta</option>
          <option value="PAQUETE">Solo paquete cerrado</option>
          <option value="AMBOS">Pieza y paquete</option>
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
