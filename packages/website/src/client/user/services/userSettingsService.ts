import {
  CompareCpusViewModel,
  CompareGpusViewModel,
  UpdateUserSettingsRequest,
  ViewCpuViewModel,
  ViewGpuViewModel,
} from '@pcpartdb/shared';
import { ApiClient, apiClient } from '../../shared/api/apiClient';

const PATH = 'user-settings';

export class UserSettingsService {
  constructor(private api: ApiClient) {}

  async update(data: UpdateUserSettingsRequest) {
    return await this.api.put<
      | ViewCpuViewModel
      | ViewGpuViewModel
      | CompareCpusViewModel
      | CompareGpusViewModel
      | null
    >(PATH, data);
  }
}

export const userSettingsService = new UserSettingsService(apiClient);
