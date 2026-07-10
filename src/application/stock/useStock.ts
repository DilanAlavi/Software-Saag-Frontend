import { useCallback, useEffect, useState } from 'react';
import { StockConDetalle } from '../../domain/stock/stock.entity';
import { stockApiRepository } from '../../infrastructure/api/stock.api';
import { ConfirmarStockInput, GuardarStockInput } from './stock.port';

export function useStock() {
  const [filas, setFilas] = useState<StockConDetalle[]>([]);
  const [cargando, setCargando] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      setFilas(await stockApiRepository.listar());
    } finally {
      setCargando(false);
    }
  }, []);

  const guardar = useCallback(
    async (dto: GuardarStockInput) => {
      await stockApiRepository.guardar(dto);
      await cargar();
    },
    [cargar],
  );

  const confirmar = useCallback(
    async (dto: ConfirmarStockInput) => {
      await stockApiRepository.confirmar(dto);
      await cargar();
    },
    [cargar],
  );

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { filas, cargando, guardar, confirmar };
}
