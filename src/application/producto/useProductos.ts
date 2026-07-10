import { useCallback, useEffect, useRef, useState } from 'react';
import { Producto } from '../../domain/producto/producto.entity';
import { productoApiRepository } from '../../infrastructure/api/producto.api';
import { ActualizarProductoInput, CrearProductoInput, ProductoFiltros } from './producto.port';

export function useProductos(filtros: ProductoFiltros) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(false);
  const [filtrosDebounced, setFiltrosDebounced] = useState(filtros);
  const ultimaPeticion = useRef(0);

  useEffect(() => {
    const temporizador = setTimeout(() => setFiltrosDebounced(filtros), 300);
    return () => clearTimeout(temporizador);
  }, [filtros.search, filtros.tipoProducto]);

  const cargar = useCallback(async () => {
    const idPeticion = ++ultimaPeticion.current;
    setCargando(true);
    try {
      const resultado = await productoApiRepository.listar(filtrosDebounced);
      if (idPeticion === ultimaPeticion.current) {
        setProductos(resultado);
      }
    } finally {
      if (idPeticion === ultimaPeticion.current) setCargando(false);
    }
  }, [filtrosDebounced.search, filtrosDebounced.tipoProducto]);

  const crear = useCallback(
    async (dto: CrearProductoInput) => {
      const creado = await productoApiRepository.crear(dto);
      await cargar();
      return creado;
    },
    [cargar],
  );

  const actualizar = useCallback(
    async (id: number, dto: ActualizarProductoInput) => {
      const actualizado = await productoApiRepository.actualizar(id, dto);
      await cargar();
      return actualizado;
    },
    [cargar],
  );

  const eliminar = useCallback(
    async (id: number) => {
      await productoApiRepository.eliminar(id);
      await cargar();
    },
    [cargar],
  );

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { productos, cargando, crear, actualizar, eliminar };
}
