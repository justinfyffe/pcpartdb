import {
  ApiKey,
  CreateUserRequest,
  joinUrlParts,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
  UpdateUserRequest,
  User,
} from '@pcpartdb/shared';
import { ApiClient, apiClient } from '../shared/api/apiClient';

const PATH = 'users';

export class UserService {
  constructor(private api: ApiClient) {}

  async create(data: CreateUserRequest) {
    return await this.api.post<User>(PATH, data);
  }

  async update(id: number, data: UpdateUserRequest) {
    const path = joinUrlParts(PATH, String(id));
    return await this.api.put<User>(path, data);
  }

  async delete(id: number) {
    const path = joinUrlParts(PATH, String(id));
    await this.api.delete(path);
  }

  async requestPasswordReset(data: RequestPasswordResetRequest) {
    const path = joinUrlParts(PATH, 'request-password-reset');
    await this.api.post(path, data);
  }

  async resetPassword(data: ResetPasswordRequest) {
    const path = joinUrlParts(PATH, 'reset-password');
    await this.api.post(path, data);
  }

  async refreshApiKey() {
    const path = joinUrlParts(PATH, 'refresh-api-key');
    return await this.api.post<ApiKey>(path, null);
  }
}

export const userService = new UserService(apiClient);
