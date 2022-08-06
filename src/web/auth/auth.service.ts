import { AccessToken, LoginRequest } from '../../types/auth';
import { UserRequest } from '../../types/user';
import { ApiClient, apiClient } from '../shared/api/api-client';

export class AuthService {
  constructor(private api: ApiClient) {}

  async loadCurrentUser() {
    return await this.api.get<AccessToken>('access-tokens');
  }

  async login(data: LoginRequest) {
    return await this.api.post<AccessToken>('access-tokens', data);
  }

  async register(data: UserRequest) {
    return await this.api.post('users', data);
  }

  async logout() {
    return await this.api.delete('access-tokens');
  }
}

export const authService = new AuthService(apiClient);
