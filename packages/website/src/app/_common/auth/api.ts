import { AccessToken, LoginRequest } from '@pcpartdb/shared';
import { apiClient } from '../api/ApiClient';

export async function login(data: LoginRequest) {
  return await apiClient.post<AccessToken>('access-tokens', data);
}

export async function logout() {
  return await apiClient.delete('access-tokens');
}
