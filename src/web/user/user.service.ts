import { denormalize } from 'normalizr';
import {
  RequestPasswordResetRequest,
  ResetPasswordRequest,
  UserRequest,
  UserResponse,
  userSchema,
  UsersResponse,
} from '../../types/user';
import { ApiClient, apiClient } from '../shared/api/api-client';

const PATH = 'users';

export class UserService {
  constructor(private api: ApiClient) {}

  async list() {
    const response = await this.api.get<UsersResponse>(PATH);
    return denormalize(response.result, [userSchema], response.entities);
  }

  async get(id: number) {
    const response = await this.api.get<UserResponse>(`${PATH}/${id}`);
    return denormalize(response.result, userSchema, response.entities);
  }

  async create(data: UserRequest) {
    const response = await this.api.post<UserResponse>(PATH, data);
    return denormalize(response.result, userSchema, response.entities);
  }

  async update(id: number, data: UserRequest) {
    const response = await this.api.put<UserResponse>(`${PATH}/${id}`, data);
    return denormalize(response.result, userSchema, response.entities);
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
