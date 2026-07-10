import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductos } from '../../application/producto/useProductos';
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
  modoPaquete: boolean;
  unidadesPorPaquete: number | null;
}

function calcularModalidad(producto: Producto, sucursal?: Sucursal): ModalidadVentaPaquete {
  if (!producto.ventaSoloPorPaquete) return 'PIEZA';
  return sucursal?.modalidadVentaPaquete ?? 'PAQUETE';
}

function FilaCarrito({
  item,
  cotizando,
  onCambiarCantidad,
  onQuitar,
}: {
  item: ItemCarrito;
  cotizando: boolean;
  onCambiarCantidad: (cantidadReal: number) => void;
  onQuitar: () => void;
}) {
  const factor = item.modoPaquete ? item.unidadesPorPaquete ?? 1 : 1;
  const [texto, setTexto] = useState(String(item.cantidad / factor));

  useEffect(() => {
    setTexto(String(item.cantidad / factor));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.cantidad, item.modoPaquete]);

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

  return (
    <tr>
      <td>
        {item.nombre}
        {item.modoPaquete && (
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Paquete cerrado de {item.unidadesPorPaquete} u.</div>
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
          {item.modoPaquete && <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>paquete(s)</span>}
        </div>
      </td>
      <td>
        {item.precioUnitario !== null
          ? `Bs ${item.precioUnitario.toFixed(2)}`
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

  const [buscarCliente, setBuscarCliente] = useState('');
  const filtrosClientes = useMemo(() => ({ search: buscarCliente || undefined }), [buscarCliente]);
  const { clientes, crear: crearCliente } = useClientes(filtrosClientes);
  const { grupos: gruposDisponibles } = useGruposPrecioEspecial();
  const [clienteSeleccionado, setClienteSeleccionado] = useState<{ id: number; nombre: string } | null>(null);
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
    const modoPaquete = calcularModalidad(producto, sucursalActual) === 'PAQUETE' && !!producto.unidadesPorPaquete;
    const cantidadBase = modoPaquete ? producto.unidadesPorPaquete! : 1;

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
          modoPaquete,
          unidadesPorPaquete: producto.unidadesPorPaquete,
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
                          setClienteSeleccionado({ id: c.id, nombre: `${c.nombre} ${c.apellidoPaterno}` });
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
                const modoPaquete = calcularModalidad(p, sucursalActual) === 'PAQUETE' && !!p.unidadesPorPaquete;
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
                      {modoPaquete && (
                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Se vende por paquete de {p.unidadesPorPaquete} u.</div>
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
