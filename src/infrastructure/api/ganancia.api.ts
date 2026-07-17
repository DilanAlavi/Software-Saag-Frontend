import { GananciaRepositoryPort } from '../../application/ganancia/ganancia.port';
import { httpClient } from './httpClient';

export const gananciaApiRepository: GananciaRepositoryPort = {
  async resumenDia(fecha) {
    const { data } = await httpClient.get('/ganancias/dia', { params: { fecha } });
    return data;
  },
  async ultimasVentas(limit) {
    const { data } = await httpClient.get('/ganancias/ultimas-ventas', { params: { limit } });
    return data;
  },
  async historialMensual(desde, hasta) {
    const { data } = await httpClient.get('/ganancias/historial-mensual', { params: { desde, hasta } });
    return data;
  },
  async historialAnual() {
    const { data } = await httpClient.get('/ganancias/historial-anual');
    return data;
  },
};
