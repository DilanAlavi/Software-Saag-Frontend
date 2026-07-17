import { VentaRepositoryPort } from '../../application/venta/venta.port';
import { httpClient } from './httpClient';

export const ventaApiRepository: VentaRepositoryPort = {
  async cotizar(dto) {
    const { data } = await httpClient.post('/ventas/cotizar', dto);
    return data;
  },
  async crear(dto) {
    const { data } = await httpClient.post('/ventas', dto);
    return data;
  },
  async listar(filtros) {
    const { data } = await httpClient.get('/ventas', { params: filtros });
    return data;
  },
  async obtener(id) {
    const { data } = await httpClient.get(`/ventas/${id}`);
    return data;
  },
  async pagar(id, efectivoRecibido) {
    const { data } = await httpClient.patch(`/ventas/${id}/pagar`, { efectivoRecibido });
    return data;
  },
  async cancelar(id, motivo) {
    const { data } = await httpClient.patch(`/ventas/${id}/cancelar`, { motivo });
    return data;
  },
  async entregar(id, detalleIds) {
    const { data } = await httpClient.patch(`/ventas/${id}/entregar`, { detalleIds });
    return data;
  },
  async reportar(id, mensaje) {
    const { data } = await httpClient.patch(`/ventas/${id}/reporte`, { mensaje });
    return data;
  },
  async descargarProforma(id) {
    const { data } = await httpClient.get(`/ventas/${id}/proforma`, { responseType: 'blob' });
    return data;
  },
  async obtenerDeudas(search) {
    const { data } = await httpClient.get('/ventas/deudas', { params: { search } });
    return data;
  },
};
