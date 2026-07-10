import { useCallback, useEffect, useState } from 'react';
import { Sucursal } from '../../domain/sucursal/sucursal.entity';
import { sucursalApiRepository } from '../../infrastructure/api/sucursal.api';
import { ActualizarSucursalInput, CrearSucursalInput } from './sucursal.port';

export function useSucursales() {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [cargando, setCargando] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      setSucursales(await sucursalApiRepository.listar());
    } finally {
      setCargando(false);
    }
  }, []);

  const crear = useCallback(
    async (dto: CrearSucursalInput) => {
      await sucursalApiRepository.crear(dto);
      await cargar();
    },
    [cargar],
  );

  const actualizar = useCallback(
    async (id: number, dto: ActualizarSucursalInput) => {
      await sucursalApiRepository.actualizar(id, dto);
      await cargar();
    },
    [cargar],
  );

  const cambiarEstado = useCallback(
    async (id: number, estado: boolean) => {
      await sucursalApiRepository.cambiarEstado(id, estado);
      await cargar();
    },
    [cargar],
  );

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { sucursales, cargando, crear, actualizar, cambiarEstado };
}
