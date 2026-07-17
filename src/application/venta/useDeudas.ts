import { useCallback, useEffect, useState } from 'react';
import { Venta } from '../../domain/venta/venta.entity';
import { ventaApiRepository } from '../../infrastructure/api/venta.api';
import { DeudasResultado } from './venta.port';

const VACIO: DeudasResultado = { hoy: [], delMes: [], montoHoy: 0, montoDelMes: 0 };

export function useDeudas(search?: string) {
  const [datos, setDatos] = useState<DeudasResultado>(VACIO);
  const [cargando, setCargando] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const resultado = await ventaApiRepository.obtenerDeudas(search || undefined);
      setDatos(resultado);
    } finally {
      setCargando(false);
    }
  }, [search]);

  // Cuando se paga o se reporta una deuda desde esta misma vista, se quita/actualiza
  // localmente sin tener que recargar todo de nuevo.
  const quitarDeLaLista = useCallback((id: number) => {
    setDatos((actual) => ({
      ...actual,
      hoy: actual.hoy.filter((v) => v.id !== id),
      delMes: actual.delMes.filter((v) => v.id !== id),
    }));
  }, []);

  const actualizarEnLaLista = useCallback((actualizada: Venta) => {
    setDatos((actual) => ({
      ...actual,
      hoy: actual.hoy.map((v) => (v.id === actualizada.id ? actualizada : v)),
      delMes: actual.delMes.map((v) => (v.id === actualizada.id ? actualizada : v)),
    }));
  }, []);

  const pagar = useCallback(
    async (id: number, efectivoRecibido: number) => {
      await ventaApiRepository.pagar(id, efectivoRecibido);
      quitarDeLaLista(id);
    },
    [quitarDeLaLista],
  );

  const reportar = useCallback(
    async (id: number, mensaje: string) => {
      const actualizada = await ventaApiRepository.reportar(id, mensaje);
      actualizarEnLaLista(actualizada);
    },
    [actualizarEnLaLista],
  );

  useEffect(() => {
    cargar();
  }, [cargar]);

  const total = datos.hoy.length + datos.delMes.length;
  const montoTotal = datos.montoHoy + datos.montoDelMes;

  return { ...datos, total, montoTotal, cargando, recargar: cargar, pagar, reportar };
}
