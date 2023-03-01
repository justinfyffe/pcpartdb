import { ApiClient, apiClient } from '@pcpartdb/website/client/shared/api';
import { AccessToken, LoginRequest } from '@pcpartdb/website/shared/auth';
import { RegisterRequest } from '@pcpartdb/website/shared/user';

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
