import axios from 'axios';
import { ProductoRepositoryPort } from '../../application/producto/producto.port';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const productoApiRepository: ProductoRepositoryPort = {
  async listar() {
    const { data } = await axios.get(`${API_URL}/productos`);
    return data;
  },
  async crear(nuevoProducto) {
    const { data } = await axios.post(`${API_URL}/productos`, nuevoProducto);
    return data;
  },
};
