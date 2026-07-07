import { Credenciales, SesionAuth } from '../../domain/auth/auth.entity';

export interface AuthRepositoryPort {
  login(credenciales: Credenciales): Promise<SesionAuth>;
}
