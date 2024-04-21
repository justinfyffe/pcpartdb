import {
  joinUrlParts,
  RegisterRequest,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
  UpdateUserSettingsRequest,
} from '@pcpartdb/shared';
import { apiClient } from '../api/ApiClient';

const USERS_PATH = 'users';
const USER_SETTINGS_PATH = 'user-settings';

export async function updateUserSettings(data: UpdateUserSettingsRequest) {
  return await apiClient.post(USER_SETTINGS_PATH, data);
}

export async function register(data: RegisterRequest) {
  const path = joinUrlParts(USERS_PATH, 'register');
  return await apiClient.post(path, data);
}

export async function requestPasswordReset(data: RequestPasswordResetRequest) {
  const path = joinUrlParts(USERS_PATH, 'request-password-reset');
  await apiClient.post(path, data);
}

export async function resetPassword(data: ResetPasswordRequest) {
  const path = joinUrlParts(USERS_PATH, 'reset-password');
  await apiClient.post(path, data);
}
