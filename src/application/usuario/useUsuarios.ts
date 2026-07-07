import { useCallback, useEffect, useState } from 'react';
import { Usuario } from '../../domain/usuario/usuario.entity';
import { usuarioApiRepository } from '../../infrastructure/api/usuario.api';
import { UsuarioFiltros } from './usuario.port';

export function useUsuarios(filtros: UsuarioFiltros) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      setUsuarios(await usuarioApiRepository.listar(filtros));
    } finally {
      setCargando(false);
    }
  }, [filtros.search, filtros.sucursalId]);

  const cambiarEstado = useCallback(
    async (id: number, estado: boolean) => {
      await usuarioApiRepository.cambiarEstado(id, estado);
      await cargar();
    },
    [cargar],
  );

  const crear = useCallback(
    async (dto: any) => {
      const resultado = await usuarioApiRepository.crear(dto);
      await cargar();
      return resultado;
    },
    [cargar],
  );

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { usuarios, cargando, cambiarEstado, crear };
}
