import { useCallback, useEffect, useState } from 'react';
import { GrupoPrecioEspecial } from '../../domain/grupo-precio-especial/grupo-precio-especial.entity';
import { grupoPrecioEspecialApiRepository } from '../../infrastructure/api/grupo-precio-especial.api';
import { ActualizarGrupoInput, CrearGrupoInput } from './grupo-precio-especial.port';

function extraerMensajeError(e: any): string {
  return e?.response?.data?.message ?? 'Ocurrió un error inesperado';
}

export function useGruposPrecioEspecial() {
  const [grupos, setGrupos] = useState<GrupoPrecioEspecial[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      setGrupos(await grupoPrecioEspecialApiRepository.listar());
    } finally {
      setCargando(false);
    }
  }, []);

  const crear = useCallback(
    async (dto: CrearGrupoInput) => {
      await grupoPrecioEspecialApiRepository.crear(dto);
      await cargar();
    },
    [cargar],
  );

  const actualizar = useCallback(
    async (grupoId: number, dto: ActualizarGrupoInput) => {
      setError(null);
      try {
        await grupoPrecioEspecialApiRepository.actualizar(grupoId, dto);
        await cargar();
      } catch (e) {
        setError(extraerMensajeError(e));
      }
    },
    [cargar],
  );

  const agregarProducto = useCallback(
    async (grupoId: number, productoId: number) => {
      setError(null);
      try {
        await grupoPrecioEspecialApiRepository.agregarProducto(grupoId, productoId);
        await cargar();
      } catch (e) {
        setError(extraerMensajeError(e));
      }
    },
    [cargar],
  );

  const quitarProducto = useCallback(
    async (grupoId: number, productoId: number) => {
      await grupoPrecioEspecialApiRepository.quitarProducto(grupoId, productoId);
      await cargar();
    },
    [cargar],
  );

  const agregarCliente = useCallback(
    async (grupoId: number, clienteId: number) => {
      setError(null);
      try {
        await grupoPrecioEspecialApiRepository.agregarCliente(grupoId, clienteId);
        await cargar();
      } catch (e) {
        setError(extraerMensajeError(e));
      }
    },
    [cargar],
  );

  const quitarCliente = useCallback(
    async (grupoId: number, clienteId: number) => {
      await grupoPrecioEspecialApiRepository.quitarCliente(grupoId, clienteId);
      await cargar();
    },
    [cargar],
  );

  const cambiarEstado = useCallback(
    async (grupoId: number, estado: boolean) => {
      await grupoPrecioEspecialApiRepository.cambiarEstado(grupoId, estado);
      await cargar();
    },
    [cargar],
  );

  useEffect(() => {
    cargar();
  }, [cargar]);

  return {
    grupos,
    cargando,
    error,
    crear,
    actualizar,
    agregarProducto,
    quitarProducto,
    agregarCliente,
    quitarCliente,
    cambiarEstado,
  };
}
