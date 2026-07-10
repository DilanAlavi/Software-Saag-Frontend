import { useCallback, useEffect, useState } from 'react';
import { Venta } from '../../domain/venta/venta.entity';
import { ventaApiRepository } from '../../infrastructure/api/venta.api';
import { VentaFiltros } from './venta.port';

export function useVentas(filtros: VentaFiltros) {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const resultado = await ventaApiRepository.listar(filtros);
      setVentas(resultado.ventas);
      setTotal(resultado.total);
    } finally {
      setCargando(false);
    }
  }, [filtros.estado, filtros.sucursalId, filtros.fecha, filtros.search, filtros.page, filtros.pageSize]);

  // Aplica el resultado de una acción (pagar/cancelar/entregar/reportar) directo sobre la lista
  // ya cargada, sin volver a pedir todo a la nube ni mostrar un "Cargando..." de por medio.
  const aplicarActualizacion = useCallback(
    (actualizada: Venta) => {
      setVentas((actual) => {
        if (filtros.estado && actualizada.estado !== filtros.estado) {
          const seguiaEnLaLista = actual.some((v) => v.id === actualizada.id);
          if (seguiaEnLaLista) setTotal((t) => Math.max(0, t - 1));
          return actual.filter((v) => v.id !== actualizada.id);
        }
        return actual.map((v) => (v.id === actualizada.id ? actualizada : v));
      });
    },
    [filtros.estado],
  );

  const pagar = useCallback(
    async (id: number, efectivoRecibido: number) => {
      const actualizada = await ventaApiRepository.pagar(id, efectivoRecibido);
      aplicarActualizacion(actualizada);
    },
    [aplicarActualizacion],
  );

  const cancelar = useCallback(
    async (id: number, motivo: string) => {
      const actualizada = await ventaApiRepository.cancelar(id, motivo);
      aplicarActualizacion(actualizada);
    },
    [aplicarActualizacion],
  );

  const entregar = useCallback(
    async (id: number, detalleIds: number[]) => {
      const actualizada = await ventaApiRepository.entregar(id, detalleIds);
      aplicarActualizacion(actualizada);
    },
    [aplicarActualizacion],
  );

  const reportar = useCallback(
    async (id: number, mensaje: string) => {
      const actualizada = await ventaApiRepository.reportar(id, mensaje);
      aplicarActualizacion(actualizada);
    },
    [aplicarActualizacion],
  );

  const descargarProforma = useCallback(async (id: number) => {
    const blob = await ventaApiRepository.descargarProforma(id);
    const url = window.URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = `proforma_${id}.pdf`;
    enlace.click();
    window.URL.revokeObjectURL(url);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { ventas, total, cargando, pagar, cancelar, entregar, reportar, descargarProforma };
}
