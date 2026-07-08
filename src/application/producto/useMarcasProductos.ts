import { useEffect, useState } from 'react';
import { productoApiRepository } from '../../infrastructure/api/producto.api';

export function useMarcasProductos() {
  const [marcas, setMarcas] = useState<string[]>([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    setCargando(true);
    productoApiRepository
      .marcas()
      .then(setMarcas)
      .finally(() => setCargando(false));
  }, []);

  return { marcas, cargando };
}
