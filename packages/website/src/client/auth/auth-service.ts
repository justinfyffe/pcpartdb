import { AccessToken, LoginRequest, RegisterRequest } from '@pcpartdb/shared';
import { ApiClient, apiClient } from '../shared/api';

export class AuthService {
  constructor(private api: ApiClient) {}

  async login(data: LoginRequest) {
    return await this.api.post<AccessToken>('access-tokens', data);
  }

  async register(data: RegisterRequest) {
    return await this.api.post('users/register', data);
  }

  async logout() {
    return await this.api.delete('access-tokens');
  }
}

export const authService = new AuthService(apiClient);
