import { NormalizedSchema, schema } from 'normalizr';

export const EMAIL_MAX_LENGTH = 250;
export const PASSWORD_MAX_LENGTH = 250;
export const PASSWORD_MIN_LENGTH = 5;

export interface User {
  id: number;
  email: string;
  isStaff: boolean;
  registeredAt: number;
}

export interface UserRequest {
  email: string;
  password?: string;
  isStaff?: boolean;
}

export interface RequestPasswordResetRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

interface UserEntities {
  users: Record<string, User>;
}

export type UserResponse = NormalizedSchema<UserEntities, number>;
export type UsersResponse = NormalizedSchema<UserEntities, number[]>;

export const userSchema = new schema.Entity('users');
