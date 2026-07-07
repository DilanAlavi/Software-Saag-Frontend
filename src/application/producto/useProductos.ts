import { useCallback, useEffect, useState } from 'react';
import { NuevoProducto, Producto } from '../../domain/producto/producto.entity';
import { productoApiRepository } from '../../infrastructure/api/producto.api';

export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      setProductos(await productoApiRepository.listar());
    } finally {
      setCargando(false);
    }
  }, []);

  const crear = useCallback(
    async (data: NuevoProducto) => {
      await productoApiRepository.crear(data);
      await cargar();
    },
    [cargar],
  );

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { productos, cargando, cargar, crear };
}
