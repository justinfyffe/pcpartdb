import { ApiClient, apiClient } from '@client/shared/api';
import { AccessToken, LoginRequest } from '@shared/auth';
import { RegisterRequest } from '@shared/user';

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
