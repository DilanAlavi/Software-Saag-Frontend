import { useCallback, useEffect, useState } from 'react';
import {
  HistorialGanancias,
  HistorialGananciasAnual,
  ResumenGananciasDia,
  VentaConGanancia,
} from '../../domain/ganancia/ganancia.entity';
import { gananciaApiRepository } from '../../infrastructure/api/ganancia.api';

export function useResumenGananciasDia() {
  const [resumen, setResumen] = useState<ResumenGananciasDia | null>(null);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      setResumen(await gananciaApiRepository.resumenDia());
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { resumen, ventas: resumen?.ventas ?? [], cargando };
}

export function useUltimasVentasGanancia(limit = 10) {
  const [ventas, setVentas] = useState<VentaConGanancia[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      setVentas(await gananciaApiRepository.ultimasVentas(limit));
    } finally {
      setCargando(false);
    }
  }, [limit]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { ventas, cargando };
}

export function useHistorialGananciasMensual(desde?: string, hasta?: string) {
  const [historial, setHistorial] = useState<HistorialGanancias | null>(null);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      setHistorial(await gananciaApiRepository.historialMensual(desde, hasta));
    } finally {
      setCargando(false);
    }
  }, [desde, hasta]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { historial, cargando };
}

export function useHistorialGananciasAnual() {
  const [historial, setHistorial] = useState<HistorialGananciasAnual | null>(null);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      setHistorial(await gananciaApiRepository.historialAnual());
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { historial, cargando };
}
