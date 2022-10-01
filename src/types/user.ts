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
