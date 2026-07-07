import { useCallback, useEffect, useState } from 'react';
import { Cliente } from '../../domain/cliente/cliente.entity';
import { clienteApiRepository } from '../../infrastructure/api/cliente.api';
import { ClienteFiltros } from './cliente.port';

export function useClientes(filtros: ClienteFiltros) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cargando, setCargando] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      setClientes(await clienteApiRepository.listar(filtros));
    } finally {
      setCargando(false);
    }
  }, [filtros.search, filtros.rol]);

  const cambiarEstado = useCallback(
    async (id: number, estado: boolean) => {
      await clienteApiRepository.cambiarEstado(id, estado);
      await cargar();
    },
    [cargar],
  );

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { clientes, cargando, cambiarEstado };
}
