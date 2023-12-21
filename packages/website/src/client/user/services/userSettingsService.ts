import { UpdateUserSettingsRequest, ViewGpuViewModel } from '@pcpartdb/shared';
import { ApiClient, apiClient } from '../../shared/api/apiClient';

const PATH = 'user-settings';

export class UserSettingsService {
  constructor(private api: ApiClient) {}

  async update(settings: UpdateUserSettingsRequest) {
    return await this.api.post<ViewGpuViewModel | null>(PATH, settings);
  }
}

export const userSettingsService = new UserSettingsService(apiClient);
