import { useCallback, useEffect, useState } from 'react';
import { Marca } from '../../domain/marca/marca.entity';
import { marcaApiRepository } from '../../infrastructure/api/marca.api';

export function useMarcas() {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [cargando, setCargando] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      setMarcas(await marcaApiRepository.listar());
    } finally {
      setCargando(false);
    }
  }, []);

  const crear = useCallback(
    async (nombre: string) => {
      await marcaApiRepository.crear(nombre);
      await cargar();
    },
    [cargar],
  );

  const eliminar = useCallback(
    async (id: number) => {
      await marcaApiRepository.eliminar(id);
      await cargar();
    },
    [cargar],
  );

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { marcas, cargando, crear, eliminar };
}
