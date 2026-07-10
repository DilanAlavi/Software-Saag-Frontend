import { FormEvent, useState } from 'react';
import { Precio } from '../../domain/precio/precio.entity';
import './modal.css';

interface Props {
  nombreProducto: string;
  precioInicial: Precio | null;
  onCancelar: () => void;
  onGuardar: (dto: any) => Promise<void>;
}

const CAMPOS_VENTA: { campo: string; etiqueta: string }[] = [
  { campo: 'menor1', etiqueta: 'Standard 1' },
  { campo: 'menor2', etiqueta: 'Standard 2' },
  { campo: 'mayor1', etiqueta: 'Mayor 1' },
  { campo: 'mayor2', etiqueta: 'Mayor 2' },
  { campo: 'plomeria', etiqueta: 'Plomería' },
  { campo: 'carpinteria', etiqueta: 'Carpintería' },
  { campo: 'electricista', etiqueta: 'Electricista' },
];

export function FormularioPrecio({ nombreProducto, precioInicial, onCancelar, onGuardar }: Props) {
  const [valores, setValores] = useState<Record<string, string>>({
    precioCosto: precioInicial?.precioCosto.toString() ?? '',
    menor1: precioInicial?.menor1.toString() ?? '',
    menor2: precioInicial?.menor2.toString() ?? '',
    mayor1: precioInicial?.mayor1.toString() ?? '',
    mayor2: precioInicial?.mayor2.toString() ?? '',
    plomeria: precioInicial?.plomeria.toString() ?? '',
    carpinteria: precioInicial?.carpinteria.toString() ?? '',
    electricista: precioInicial?.electricista.toString() ?? '',
    precioCaja: precioInicial?.precioCaja?.toString() ?? '',
    precioPiezaSuelta: precioInicial?.precioPiezaSuelta?.toString() ?? '',
    cantidadMinimaDescuentoMenor1: precioInicial?.cantidadMinimaDescuentoMenor1?.toString() ?? '',
    precioDescuentoMenor1: precioInicial?.precioDescuentoMenor1?.toString() ?? '',
  });
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const set = (campo: string, valor: string) => setValores((v) => ({ ...v, [campo]: valor }));

  const validar = (dto: any): string | null => {
    for (const { campo, etiqueta } of CAMPOS_VENTA) {
      if (dto[campo] <= dto.precioCosto) {
        return `El precio "${etiqueta}" debe ser mayor al Precio Base (${dto.precioCosto})`;
      }
    }
    if (dto.precioCaja !== undefined && dto.precioCaja <= dto.precioCosto) {
      return `El precio de Caja debe ser mayor al Precio Base (${dto.precioCosto})`;
    }
    if (dto.precioPiezaSuelta !== undefined && dto.precioPiezaSuelta <= dto.precioCosto) {
      return `El precio de pieza suelta debe ser mayor al Precio Base (${dto.precioCosto})`;
    }
    if (dto.precioDescuentoMenor1 !== undefined) {
      if (dto.cantidadMinimaDescuentoMenor1 === undefined) {
        return 'Indica la cantidad mínima para aplicar el descuento de Standard 1';
      }
      if (dto.precioDescuentoMenor1 >= dto.menor1) {
        return `El precio con descuento debe ser menor al precio normal de Standard 1 (${dto.menor1})`;
      }
    }
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const dto: any = {
      precioCosto: Number(valores.precioCosto),
      menor1: Number(valores.menor1),
      menor2: Number(valores.menor2),
      mayor1: Number(valores.mayor1),
      mayor2: Number(valores.mayor2),
      plomeria: Number(valores.plomeria),
      carpinteria: Number(valores.carpinteria),
      electricista: Number(valores.electricista),
      precioCaja: valores.precioCaja ? Number(valores.precioCaja) : undefined,
      precioPiezaSuelta: valores.precioPiezaSuelta ? Number(valores.precioPiezaSuelta) : undefined,
      cantidadMinimaDescuentoMenor1: valores.cantidadMinimaDescuentoMenor1
        ? Number(valores.cantidadMinimaDescuentoMenor1)
        : undefined,
      precioDescuentoMenor1: valores.precioDescuentoMenor1 ? Number(valores.precioDescuentoMenor1) : undefined,
    };

    const mensajeError = validar(dto);
    if (mensajeError) {
      setError(mensajeError);
      return;
    }

    setError(null);
    setEnviando(true);
    try {
      await onGuardar(dto);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="saag-modal-overlay">
      <form onSubmit={handleSubmit} className="saag-modal-caja">
        <h3 style={{ marginTop: 0 }}>Precios — {nombreProducto}</h3>

        <label style={etiquetaStyle}>Precio Base</label>
        <input
          className="saag-input-full"
          type="number"
          step="0.01"
          value={valores.precioCosto}
          onChange={(e) => set('precioCosto', e.target.value)}
          required
        />

        {CAMPOS_VENTA.map(({ campo, etiqueta }) => (
          <div key={campo}>
            <label style={etiquetaStyle}>{etiqueta}</label>
            <input
              className="saag-input-full"
              type="number"
              step="0.01"
              value={valores[campo]}
              onChange={(e) => set(campo, e.target.value)}
              required
            />
          </div>
        ))}

        <label style={etiquetaStyle}>Precio de Caja (opcional)</label>
        <input
          className="saag-input-full"
          type="number"
          step="0.01"
          value={valores.precioCaja}
          onChange={(e) => set('precioCaja', e.target.value)}
        />

        <label style={etiquetaStyle}>Precio de pieza suelta (opcional — para productos con paquete)</label>
        <input
          className="saag-input-full"
          type="number"
          step="0.01"
          value={valores.precioPiezaSuelta}
          onChange={(e) => set('precioPiezaSuelta', e.target.value)}
        />

        <label style={etiquetaStyle}>Descuento Standard 1 — cantidad mínima (opcional)</label>
        <input
          className="saag-input-full"
          type="number"
          value={valores.cantidadMinimaDescuentoMenor1}
          onChange={(e) => set('cantidadMinimaDescuentoMenor1', e.target.value)}
        />

        <label style={etiquetaStyle}>Descuento Standard 1 — precio con descuento (opcional)</label>
        <input
          className="saag-input-full"
          type="number"
          step="0.01"
          value={valores.precioDescuentoMenor1}
          onChange={(e) => set('precioDescuentoMenor1', e.target.value)}
        />

        {error && <p style={{ color: 'var(--color-danger)', fontSize: 13, margin: 0 }}>{error}</p>}

        <div className="saag-modal-acciones">
          <button type="button" onClick={onCancelar} className="btn btn-secondary">
            Cancelar
          </button>
          <button type="submit" disabled={enviando} className="btn btn-primary">
            {enviando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
}

const etiquetaStyle = { fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 2, display: 'block' } as const;
