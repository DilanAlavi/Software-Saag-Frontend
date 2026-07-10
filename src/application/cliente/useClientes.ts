import { useCallback, useEffect, useRef, useState } from 'react';
import { Cliente } from '../../domain/cliente/cliente.entity';
import { clienteApiRepository } from '../../infrastructure/api/cliente.api';
import { ActualizarClienteInput, ClienteFiltros, CrearClienteInput } from './cliente.port';

export function useClientes(filtros: ClienteFiltros) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cargando, setCargando] = useState(false);
  const [filtrosDebounced, setFiltrosDebounced] = useState(filtros);
  const ultimaPeticion = useRef(0);

  useEffect(() => {
    const temporizador = setTimeout(() => setFiltrosDebounced(filtros), 300);
    return () => clearTimeout(temporizador);
  }, [filtros.search, filtros.rol]);

  const cargar = useCallback(async () => {
    const idPeticion = ++ultimaPeticion.current;
    setCargando(true);
    try {
      const resultado = await clienteApiRepository.listar(filtrosDebounced);
      if (idPeticion === ultimaPeticion.current) {
        setClientes(resultado);
      }
    } finally {
      if (idPeticion === ultimaPeticion.current) setCargando(false);
    }
  }, [filtrosDebounced.search, filtrosDebounced.rol]);

  const cambiarEstado = useCallback(
    async (id: number, estado: boolean) => {
      await clienteApiRepository.cambiarEstado(id, estado);
      await cargar();
    },
    [cargar],
  );

  const crear = useCallback(
    async (dto: CrearClienteInput) => {
      const creado = await clienteApiRepository.crear(dto);
      await cargar();
      return creado;
    },
    [cargar],
  );

  const actualizar = useCallback(
    async (id: number, dto: ActualizarClienteInput) => {
      const actualizado = await clienteApiRepository.actualizar(id, dto);
      await cargar();
      return actualizado;
    },
    [cargar],
  );

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { clientes, cargando, cambiarEstado, crear, actualizar, recargar: cargar };
}
