import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductos } from '../../application/producto/useProductos';
import { usePrecios } from '../../application/precio/usePrecios';
import { Precio } from '../../domain/precio/precio.entity';
import { useClientes } from '../../application/cliente/useClientes';
import { useGruposPrecioEspecial } from '../../application/grupo-precio-especial/useGruposPrecioEspecial';
import { grupoPrecioEspecialApiRepository } from '../../infrastructure/api/grupo-precio-especial.api';
import { useSucursales } from '../../application/sucursal/useSucursales';
import { obtenerUsuarioActual } from '../../application/auth/useAuth';
import { ventaApiRepository } from '../../infrastructure/api/venta.api';
import { ETIQUETAS_ROL_CLIENTE } from '../../domain/cliente/cliente.entity';
import { Producto } from '../../domain/producto/producto.entity';
import { Sucursal, ModalidadVentaPaquete } from '../../domain/sucursal/sucursal.entity';
import { FormularioCliente } from '../components/FormularioCliente';
import '../components/modal.css';

interface ItemCarrito {
  productoId: number;
  nombre: string;
  cantidad: number; // siempre en unidades sueltas reales
  precioUnitario: number | null;
  total: number | null;
  modalidadEfectiva: ModalidadVentaPaquete;
  unidadesPorPaquete: number | null;
  unidadesPorCaja: number | null;
  unidadVenta: string | null;
  unidadVentaTamano: number | null;
  redondeoSiempreArriba: boolean;
  notaVenta: string | null;
}

function formatearCantidadUnidadVenta(piezas: number | null, unidadVentaTamano: number | null, unidad: string): string {
  if (piezas === null) return '';
  if (unidadVentaTamano) return `${piezas / unidadVentaTamano} ${unidad}`;
  return `${piezas} ${unidad}`;
}

function calcularModalidad(producto: Producto, sucursal?: Sucursal): ModalidadVentaPaquete {
  if (!producto.ventaSoloPorPaquete) return 'PIEZA';
  return sucursal?.modalidadVentaPaquete ?? 'PAQUETE';
}

/**
 * El modo caja depende solo del producto y la sucursal (modalidadEfectiva), nunca del rol del
 * cliente — si la sucursal vende suelto, cualquier rol puede comprar suelto ahí.
 * Excepción: productos con "redondeoSiempreArriba" (ej. Grasa, que se vende de 3 en 3) usan
 * una lógica distinta — siempre se ingresa en piezas sueltas, nunca en "cajas", y el motor de
 * precios ajusta el precio solo según la cantidad exacta que se escriba.
 */
function calcularModoCaja(
  unidadesPorPaquete: number | null,
  modalidadEfectiva: ModalidadVentaPaquete,
  redondeoSiempreArriba: boolean,
): boolean {
  if (redondeoSiempreArriba) return false;
  return Boolean(unidadesPorPaquete) && modalidadEfectiva === 'PAQUETE';
}

const MAPA_RUBRO_ROL: Record<string, string> = {
  CARPINTERIA: 'CARPINTERIA',
  PLOMERIA: 'PLOMERIA',
  ELECTRICISTA: 'ELECTRICO',
};

/**
 * Precio de referencia para mostrar al lado del código en el buscador — no es el precio final
 * (eso lo calcula el motor de precios al agregar al carrito), es solo una guía rápida para
 * el vendedor. Sin cliente elegido todavía, se muestra el de Standard 1 (el más alto).
 */
function precioReferencia(precio: Precio, tipoProducto: string, rolCliente?: string): number {
  if (!rolCliente || rolCliente === 'STANDARD_1') return precio.menor1;
  if (rolCliente === 'STANDARD_2') return precio.menor2;
  if (rolCliente === 'MAYOR_1') return precio.mayor1;
  if (rolCliente === 'MAYOR_2') return precio.mayor2;
  if (MAPA_RUBRO_ROL[rolCliente] === tipoProducto) {
    if (rolCliente === 'CARPINTERIA') return precio.carpinteria;
    if (rolCliente === 'PLOMERIA') return precio.plomeria;
    if (rolCliente === 'ELECTRICISTA') return precio.electricista;
  }
  return precio.menor2;
}

function FilaCarrito({
  item,
  rolCliente,
  cotizando,
  onCambiarCantidad,
  onQuitar,
}: {
  item: ItemCarrito;
  rolCliente?: string;
  cotizando: boolean;
  onCambiarCantidad: (cantidadReal: number) => void;
  onQuitar: () => void;
}) {
  const modoCaja = calcularModoCaja(item.unidadesPorPaquete, item.modalidadEfectiva, item.redondeoSiempreArriba);
  // Modo "par" (o la unidad de venta que sea): la cantidad y el precio unitario se muestran
  // en esa unidad, no en piezas sueltas. No aplica si ya estamos en modo caja.
  const modoUnidadVenta = !modoCaja && Boolean(item.unidadVentaTamano);
  const factor = modoCaja ? item.unidadesPorPaquete ?? 1 : modoUnidadVenta ? item.unidadVentaTamano! : 1;
  const [texto, setTexto] = useState(String(item.cantidad / factor));

  useEffect(() => {
    setTexto(String(item.cantidad / factor));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.cantidad, modoCaja, modoUnidadVenta]);

  const revertirSiInvalido = () => {
    const n = Number(texto);
    if (texto.trim() === '' || Number.isNaN(n) || n <= 0) {
      setTexto(String(item.cantidad / factor));
    }
  };

  const manejarCambio = (valor: string) => {
    setTexto(valor);
    const n = Number(valor);
    if (valor.trim() !== '' && !Number.isNaN(n) && n > 0) {
      onCambiarCantidad(Math.round(n) * factor);
    }
  };

  const unidad = item.unidadVenta || 'pcs';
  const paresPorCaja =
    item.unidadesPorPaquete && item.unidadVentaTamano ? item.unidadesPorPaquete / item.unidadVentaTamano : null;
  // El precio unitario y total que ya calculó el backend son siempre por pieza suelta;
  // en modo "unidad de venta" se muestra multiplicado, para que coincida con la cantidad
  // ingresada (ej. si la cantidad está en pares, el precio unitario también debe ser por par).
  const precioMostrado = item.precioUnitario !== null ? item.precioUnitario * factor : null;

  return (
    <tr>
      <td>
        {item.nombre}
        {(item.unidadesPorCaja || modoCaja) && (
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            {item.unidadesPorCaja && `1 caja tiene ${formatearCantidadUnidadVenta(item.unidadesPorCaja, item.unidadVentaTamano, unidad)}`}
            {item.unidadesPorCaja && modoCaja && ', '}
            {modoCaja &&
              (paresPorCaja !== null
                ? `caja (${paresPorCaja} ${unidad})`
                : `paquete cerrado de ${item.unidadesPorPaquete} pcs`)}
          </div>
        )}
        {item.notaVenta && (
          <div style={{ fontSize: 12, color: 'var(--color-danger)', fontWeight: 600 }}>{item.notaVenta}</div>
        )}
      </td>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input
            className="input"
            style={{ width: 70 }}
            value={texto}
            onChange={(e) => manejarCambio(e.target.value)}
            onBlur={revertirSiInvalido}
            onKeyDown={(e) => {
              if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
            }}
          />
          {modoCaja && <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>caja(s)</span>}
          {modoUnidadVenta && <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{unidad}(es)</span>}
        </div>
      </td>
      <td>
        {precioMostrado !== null
          ? `Bs ${precioMostrado.toFixed(2)}`
          : cotizando
            ? 'Calculando...'
            : 'Falta cliente y sucursal'}
      </td>
      <td>{item.total !== null ? `Bs ${item.total.toFixed(2)}` : '—'}</td>
      <td>
        <button className="btn btn-secondary btn-sm" onClick={onQuitar}>
          Quitar
        </button>
      </td>
    </tr>
  );
}

export function NuevaVentaPage() {
  const navigate = useNavigate();
  const usuarioActual = obtenerUsuarioActual();
  const esAdmin = usuarioActual?.rol === 'ADMIN';

  const [buscarProducto, setBuscarProducto] = useState('');
  const filtrosProductos = useMemo(() => ({ search: buscarProducto || undefined }), [buscarProducto]);
  const { productos } = useProductos(filtrosProductos);
  const { filas: filasPrecios } = usePrecios();
  const preciosPorProducto = useMemo(() => new Map(filasPrecios.map((f) => [f.productoId, f.precio])), [filasPrecios]);

  const [buscarCliente, setBuscarCliente] = useState('');
  const filtrosClientes = useMemo(() => ({ search: buscarCliente || undefined }), [buscarCliente]);
  const { clientes, crear: crearCliente } = useClientes(filtrosClientes);
  const { grupos: gruposDisponibles } = useGruposPrecioEspecial();
  const [clienteSeleccionado, setClienteSeleccionado] = useState<{ id: number; nombre: string; rol?: string } | null>(null);
  const [mostrarFormularioCliente, setMostrarFormularioCliente] = useState(false);

  const { sucursales } = useSucursales();
  const [sucursalId, setSucursalId] = useState<string>('');

  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [cotizando, setCotizando] = useState(false);

  const [pagarAhora, setPagarAhora] = useState(true);
  const [efectivoRecibido, setEfectivoRecibido] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ventaCreada, setVentaCreada] = useState<{ id: number; total: number } | null>(null);

  const sucursalEfectivaId = esAdmin ? (sucursalId ? Number(sucursalId) : undefined) : usuarioActual?.sucursalId ?? undefined;
  const sucursalActual = sucursales.find((s) => s.id === sucursalEfectivaId);

  const totalCarrito = carrito.reduce((acc, item) => acc + (item.total ?? 0), 0);
  const vuelto = pagarAhora && efectivoRecibido !== '' ? Number(efectivoRecibido) - totalCarrito : null;

  // Recotizar cada vez que cambia el carrito, el cliente o la sucursal (con un pequeño debounce
  // para no mandar un pedido a la nube por cada dígito que se escribe en la cantidad)
  useEffect(() => {
    if (carrito.length === 0 || !clienteSeleccionado || !sucursalEfectivaId) {
      setCotizando(false);
      return;
    }
    let cancelado = false;
    setCotizando(true);
    const temporizador = setTimeout(() => {
      ventaApiRepository
        .cotizar({
          clienteId: clienteSeleccionado.id,
          sucursalId: sucursalEfectivaId,
          lineas: carrito.map((item) => ({ productoId: item.productoId, cantidad: item.cantidad })),
        })
        .then((resultado) => {
          if (cancelado) return;
          setError(null);
          setCarrito((actual) =>
            actual.map((item) => {
              const linea = resultado.lineas.find((l) => l.productoId === item.productoId);
              return linea ? { ...item, precioUnitario: linea.precioUnitario, total: linea.total } : item;
            }),
          );
        })
        .catch((e) => {
          if (!cancelado) setError(e?.response?.data?.message ?? 'No se pudo calcular el precio');
        })
        .finally(() => {
          if (!cancelado) setCotizando(false);
        });
    }, 350);
    return () => {
      cancelado = true;
      clearTimeout(temporizador);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clienteSeleccionado?.id, sucursalEfectivaId, JSON.stringify(carrito.map((i) => [i.productoId, i.cantidad]))]);

  const agregarProductoAlCarrito = (producto: Producto) => {
    const modalidadEfectiva = calcularModalidad(producto, sucursalActual);
    const modoCaja = calcularModoCaja(producto.unidadesPorPaquete, modalidadEfectiva, producto.redondeoSiempreArriba);
    const cantidadBase =
      modoCaja || producto.redondeoSiempreArriba
        ? producto.unidadesPorPaquete ?? 1
        : producto.unidadVentaTamano
          ? producto.unidadVentaTamano
          : 1;

    setCarrito((actual) => {
      const existente = actual.find((item) => item.productoId === producto.id);
      if (existente) {
        return actual.map((item) => (item.productoId === producto.id ? { ...item, cantidad: item.cantidad + cantidadBase } : item));
      }
      return [
        ...actual,
        {
          productoId: producto.id,
          nombre: producto.nombre,
          cantidad: cantidadBase,
          precioUnitario: null,
          total: null,
          modalidadEfectiva,
          unidadesPorPaquete: producto.unidadesPorPaquete,
          unidadesPorCaja: producto.unidadesPorCaja,
          unidadVenta: producto.unidadVenta,
          unidadVentaTamano: producto.unidadVentaTamano,
          redondeoSiempreArriba: producto.redondeoSiempreArriba,
          notaVenta: producto.notaVenta,
        },
      ];
    });
    setBuscarProducto('');
  };

  const quitarDelCarrito = (productoId: number) => {
    setCarrito((actual) => actual.filter((item) => item.productoId !== productoId));
  };

  const cambiarCantidad = (productoId: number, cantidadReal: number) => {
    setCarrito((actual) => actual.map((item) => (item.productoId === productoId ? { ...item, cantidad: cantidadReal } : item)));
  };

  const puedeConfirmar =
    clienteSeleccionado &&
    sucursalEfectivaId &&
    carrito.length > 0 &&
    carrito.every((i) => i.precioUnitario !== null) &&
    (!pagarAhora || (efectivoRecibido !== '' && Number(efectivoRecibido) >= totalCarrito));

  const confirmarVenta = async () => {
    if (!clienteSeleccionado || !sucursalEfectivaId) return;
    setEnviando(true);
    setError(null);
    try {
      const venta = await ventaApiRepository.crear({
        clienteId: clienteSeleccionado.id,
        sucursalId: esAdmin ? sucursalEfectivaId : undefined,
        lineas: carrito.map((item) => ({ productoId: item.productoId, cantidad: item.cantidad })),
        pagarAhora,
        efectivoRecibido: pagarAhora ? Number(efectivoRecibido) : undefined,
      });
      setVentaCreada({ id: venta.id, total: venta.total });
      setCarrito([]);
      setClienteSeleccionado(null);
      setEfectivoRecibido('');
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'No se pudo registrar la venta');
    } finally {
      setEnviando(false);
    }
  };

  if (ventaCreada) {
    return (
      <div className="card" style={{ padding: 32, maxWidth: 520 }}>
        <h1 style={{ color: 'var(--color-success)', marginTop: 0 }}>Venta registrada</h1>
        <p>
          La venta <strong>#{ventaCreada.id}</strong> se registró correctamente. Total:{' '}
          <strong>Bs {ventaCreada.total.toFixed(2)}</strong>
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => ventaApiRepository.descargarProforma(ventaCreada.id).then(descargarBlob(ventaCreada.id))}>
            Descargar proforma
          </button>
          <button className="btn btn-secondary" onClick={() => setVentaCreada(null)}>
            Registrar otra venta
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/panel/ventas')}>
            Ver historial de ventas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>Nueva venta</h1>
      </div>
      {error && (
        <p style={{ color: 'var(--color-danger)', background: 'var(--color-danger-soft)', padding: '10px 14px', borderRadius: 8 }}>
          {error}
        </p>
      )}

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card" style={{ padding: 18 }}>
          <h3 style={{ marginTop: 0 }}>Cliente</h3>
          {clienteSeleccionado ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontWeight: 600 }}>{clienteSeleccionado.nombre}</span>
              <button className="btn btn-secondary btn-sm" onClick={() => setClienteSeleccionado(null)}>
                Cambiar
              </button>
            </div>
          ) : (
            <>
              <input
                className="input"
                placeholder="Buscar cliente por nombre..."
                value={buscarCliente}
                onChange={(e) => setBuscarCliente(e.target.value)}
              />
              {buscarCliente && (
                <div style={{ border: '1px solid var(--color-border)', borderRadius: 8, marginTop: 8, maxHeight: 160, overflowY: 'auto' }}>
                  {clientes.length === 0 ? (
                    <p style={{ padding: 8, margin: 0, fontSize: 13 }}>Sin resultados.</p>
                  ) : (
                    clientes.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setClienteSeleccionado({ id: c.id, nombre: `${c.nombre} ${c.apellidoPaterno}`, rol: c.rol });
                          setBuscarCliente('');
                        }}
                        style={{ padding: 10, cursor: 'pointer', borderBottom: '1px solid var(--color-border)', fontSize: 14 }}
                      >
                        <div>
                          {c.nombre} {c.apellidoPaterno} — {ETIQUETAS_ROL_CLIENTE[c.rol]}
                        </div>
                        {c.grupos.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                            {c.grupos.map((g) => (
                              <span key={g.id} className="badge badge-neutral" style={{ fontSize: 11 }}>
                                {g.nombre}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
              <button className="btn btn-secondary btn-sm" style={{ marginTop: 10 }} onClick={() => setMostrarFormularioCliente(true)}>
                + Nuevo cliente
              </button>
            </>
          )}
        </div>

        <div className="card" style={{ padding: 18 }}>
          <h3 style={{ marginTop: 0 }}>Sucursal</h3>
          {esAdmin ? (
            <select className="input" value={sucursalId} onChange={(e) => setSucursalId(e.target.value)}>
              <option value="">Selecciona una sucursal</option>
              {sucursales.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
          ) : (
            <p style={{ fontWeight: 600 }}>{sucursales.find((s) => s.id === usuarioActual?.sucursalId)?.nombre ?? 'Tu sucursal asignada'}</p>
          )}
        </div>
      </div>

      <div className="card" style={{ padding: 18, marginBottom: 20 }}>
        <h3 style={{ marginTop: 0 }}>Agregar productos</h3>
        <input
          className="input"
          placeholder="Buscar producto por nombre..."
          value={buscarProducto}
          onChange={(e) => setBuscarProducto(e.target.value)}
        />
        {buscarProducto && (
          <div style={{ border: '1px solid var(--color-border)', borderRadius: 8, marginTop: 8, maxHeight: 260, overflowY: 'auto' }}>
            {productos.length === 0 ? (
              <p style={{ padding: 8, margin: 0, fontSize: 13 }}>Sin resultados.</p>
            ) : (
              productos.map((p) => {
                const modalidadEfectiva = calcularModalidad(p, sucursalActual);
                const modoCaja = calcularModoCaja(p.unidadesPorPaquete, modalidadEfectiva, p.redondeoSiempreArriba);
                const unidad = p.unidadVenta || 'pcs';
                const paresPorCaja = p.unidadesPorPaquete && p.unidadVentaTamano ? p.unidadesPorPaquete / p.unidadVentaTamano : null;
                const precioProducto = preciosPorProducto.get(p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => agregarProductoAlCarrito(p)}
                    style={{
                      padding: 10,
                      cursor: 'pointer',
                      borderBottom: '1px solid var(--color-border)',
                      fontSize: 14,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>
                      {p.nombre}
                      {p.codigo && <span style={{ color: 'var(--color-text-muted)', fontSize: 12 }}> — {p.codigo}</span>}
                      {precioProducto && (
                        <span style={{ color: 'var(--color-danger)', fontSize: 12, fontWeight: 700 }}>
                          {' '}Bs {precioReferencia(precioProducto, p.tipoProducto, clienteSeleccionado?.rol).toFixed(2)} {unidad}
                        </span>
                      )}
                      {(p.unidadesPorCaja || modoCaja) && (
                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                          {p.unidadesPorCaja && `1 caja tiene ${formatearCantidadUnidadVenta(p.unidadesPorCaja, p.unidadVentaTamano, unidad)}`}
                          {p.unidadesPorCaja && modoCaja && ', '}
                          {modoCaja &&
                            (paresPorCaja !== null
                              ? `se vende por caja (${paresPorCaja} ${unidad})`
                              : `se vende por paquete de ${p.unidadesPorPaquete} pcs`)}
                        </div>
                      )}
                      {p.notaVenta && (
                        <div style={{ fontSize: 12, color: 'var(--color-danger)', fontWeight: 600 }}>{p.notaVenta}</div>
                      )}
                    </span>
                    <span className="badge badge-neutral">+ Agregar</span>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {carrito.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <div className="table-wrap" style={{ marginBottom: 20 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio unitario</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {carrito.map((item) => (
                <FilaCarrito
                  key={item.productoId}
                  item={item}
                  rolCliente={clienteSeleccionado?.rol}
                  cotizando={cotizando}
                  onCambiarCantidad={(cantidad) => cambiarCantidad(item.productoId, cantidad)}
                  onQuitar={() => quitarDelCarrito(item.productoId)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h3 style={{ color: 'var(--color-primary)' }}>Total: Bs {totalCarrito.toFixed(2)}</h3>

      <div className="card" style={{ padding: 18, marginBottom: 20, maxWidth: 420 }}>
        <div style={{ marginBottom: 12, display: 'flex', gap: 20 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="radio" checked={pagarAhora} onChange={() => setPagarAhora(true)} /> Pagar ahora
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="radio" checked={!pagarAhora} onChange={() => setPagarAhora(false)} /> Pagar después
          </label>
        </div>

        {pagarAhora && (
          <div>
            <input
              className="input"
              placeholder="Efectivo recibido"
              type="number"
              min={0}
              value={efectivoRecibido}
              onChange={(e) => setEfectivoRecibido(e.target.value)}
            />
            {vuelto !== null && (
              <p style={{ fontWeight: 700, margin: '10px 0 0', color: vuelto >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                {vuelto >= 0 ? `Vuelto: Bs ${vuelto.toFixed(2)}` : `Falta: Bs ${Math.abs(vuelto).toFixed(2)}`}
              </p>
            )}
          </div>
        )}
      </div>

      <button className="btn btn-primary" disabled={!puedeConfirmar || enviando} onClick={confirmarVenta} style={{ padding: '12px 24px' }}>
        {enviando ? 'Registrando...' : 'Confirmar venta'}
      </button>

      {mostrarFormularioCliente && (
        <FormularioCliente
          gruposDisponibles={gruposDisponibles}
          onCancelar={() => setMostrarFormularioCliente(false)}
          onGuardar={async (dto) => {
            const { grupoIds, ...datos } = dto;
            const creado = await crearCliente(datos);
            await Promise.all(grupoIds.map((id) => grupoPrecioEspecialApiRepository.agregarCliente(id, creado.id)));
            setClienteSeleccionado({ id: creado.id, nombre: `${creado.nombre} ${creado.apellidoPaterno}` });
            setMostrarFormularioCliente(false);
          }}
        />
      )}
    </div>
  );
}

function descargarBlob(id: number) {
  return (blob: Blob) => {
    const url = window.URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = `proforma_${id}.pdf`;
    enlace.click();
    window.URL.revokeObjectURL(url);
  };
}
