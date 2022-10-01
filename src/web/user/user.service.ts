import {
  RequestPasswordResetRequest,
  ResetPasswordRequest,
  User,
  UserRequest,
} from '../../types/user';
import { ApiClient, apiClient } from '../shared/api/api-client';

const PATH = 'users';

export class UserService {
  constructor(private api: ApiClient) {}

  async list() {
    return await this.api.get<User[]>(PATH);
  }

  async get(id: number) {
    return await this.api.get<User>(`${PATH}/${id}`);
  }

  async create(data: UserRequest) {
    return await this.api.post<User>(PATH, data);
  }

  async update(id: number, data: UserRequest) {
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
