import { ProductoRepositoryPort } from '../../application/producto/producto.port';
import { httpClient } from './httpClient';

export const productoApiRepository: ProductoRepositoryPort = {
  async listar(filtros) {
    const { data } = await httpClient.get('/productos', { params: filtros });
    return data;
  },
  async crear(dto) {
    const { data } = await httpClient.post('/productos', dto);
    return data;
  },
  async actualizar(id, dto) {
    const { data } = await httpClient.patch(`/productos/${id}`, dto);
    return data;
  },
  async eliminar(id) {
    const { data } = await httpClient.delete(`/productos/${id}`);
    return data;
  },
  async marcas() {
    const { data } = await httpClient.get('/productos/marcas');
    return data;
  },
  async descargarPlantilla() {
    const { data } = await httpClient.get('/productos/plantilla', { responseType: 'blob' });
    return data;
  },
  async importar(archivo) {
    const formData = new FormData();
    formData.append('archivo', archivo);
    const { data } = await httpClient.post('/productos/importar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};
