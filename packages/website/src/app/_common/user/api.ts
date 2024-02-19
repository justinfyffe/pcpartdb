import {
  CompareCpusViewModel,
  CompareGpusViewModel,
  UpdateUserSettingsRequest,
  ViewCpuViewModel,
  ViewGpuViewModel,
} from '@pcpartdb/shared';
import { apiClient } from '../api/ApiClient';

const USER_SETTINGS_PATH = 'user-settings';

export async function updateUserSettings(data: UpdateUserSettingsRequest) {
  return await apiClient.post<
    | ViewCpuViewModel
    | ViewGpuViewModel
    | CompareCpusViewModel
    | CompareGpusViewModel
    | null
  >(USER_SETTINGS_PATH, data);
}
