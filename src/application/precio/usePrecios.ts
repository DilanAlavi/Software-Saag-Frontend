import { useCallback, useEffect, useState } from 'react';
import { ProductoConPrecio } from '../../domain/precio/precio.entity';
import { precioApiRepository } from '../../infrastructure/api/precio.api';
import { GuardarPrecioInput } from './precio.port';

export function usePrecios() {
  const [filas, setFilas] = useState<ProductoConPrecio[]>([]);
  const [cargando, setCargando] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      setFilas(await precioApiRepository.listar());
    } finally {
      setCargando(false);
    }
  }, []);

  const guardar = useCallback(
    async (productoId: number, dto: GuardarPrecioInput) => {
      await precioApiRepository.guardar(productoId, dto);
      await cargar();
    },
    [cargar],
  );

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { filas, cargando, guardar, recargar: cargar };
}
