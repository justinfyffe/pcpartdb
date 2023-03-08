import {
  CreateUserRequest,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
  UpdateUserRequest,
  User,
} from '@pcpartdb/shared';
import { ApiClient, apiClient } from '../shared/api';

const PATH = 'users';

export class UserService {
  constructor(private api: ApiClient) {}

  async create(data: CreateUserRequest) {
    return await this.api.post<User>(PATH, data);
  }

  async update(id: number, data: UpdateUserRequest) {
    return await this.api.put<User>(`${PATH}/${id}`, data);
  }

  async delete(id: number) {
    await this.api.delete(`${PATH}/${id}`);
  }

  async requestPasswordReset(data: RequestPasswordResetRequest) {
    await this.api.post(`${PATH}/request-password-reset`, data);
  }

  async resetPassword(data: ResetPasswordRequest) {
    await this.api.post(`${PATH}/reset-password`, data);
  }
}

export const userService = new UserService(apiClient);
