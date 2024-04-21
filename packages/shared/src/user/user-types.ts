export const EMAIL_MAX_LENGTH = 250;
export const PASSWORD_MAX_LENGTH = 250;
export const PASSWORD_MIN_LENGTH = 5;

export interface User {
  id: number;
  email: string;
  isStaff: boolean;
  registeredAt: number;
}

import { PreferredBenchmarks } from '../product';

export interface UserSettings {
  preferredBenchmarks?: PreferredBenchmarks;
}

export interface CreateUserRequest extends Omit<User, 'id' | 'registeredAt'> {
  password: string;
}
export interface UpdateUserRequest extends Omit<User, 'id' | 'registeredAt'> {
  password?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RequestPasswordResetRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface UpdateUserSettingsRequest {
  settings: UserSettings;
}
