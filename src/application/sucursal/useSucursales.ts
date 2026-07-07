import { useEffect, useState } from 'react';
import { Sucursal } from '../../domain/sucursal/sucursal.entity';
import { sucursalApiRepository } from '../../infrastructure/api/sucursal.api';

export function useSucursales() {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);

  useEffect(() => {
    sucursalApiRepository.listar().then(setSucursales);
  }, []);

  return { sucursales };
}
