import { StockRepositoryPort } from '../../application/stock/stock.port';
import { httpClient } from './httpClient';

export const stockApiRepository: StockRepositoryPort = {
  async listar() {
    const { data } = await httpClient.get('/stock');
    return data;
  },
  async guardar(dto) {
    await httpClient.put('/stock', dto);
  },
  async confirmar(dto) {
    await httpClient.put('/stock/confirmar', dto);
  },
};
