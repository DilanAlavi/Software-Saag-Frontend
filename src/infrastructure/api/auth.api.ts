import { AuthRepositoryPort } from '../../application/auth/auth.port';
import { httpClient } from './httpClient';

export const authApiRepository: AuthRepositoryPort = {
  async login(credenciales) {
    const { data } = await httpClient.post('/auth/login', credenciales);
    return data;
  },
};
