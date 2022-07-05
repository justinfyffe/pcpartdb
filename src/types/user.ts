import Joi from '@hapi/joi';
import { NormalizedSchema, schema } from 'normalizr';

export const EMAIL_MAX_LENGTH = 250;
export const PASSWORD_MAX_LENGTH = 250;
export const PASSWORD_MIN_LENGTH = 5;

export interface User {
  id: number;
  email: string;
  isStaff: boolean;
  dateRegistered: number;
}

export interface UserFormData {
  email: string;
  password?: string;
  isStaff?: boolean;
}

export interface RequestPasswordResetFormData {
  email: string;
}

export interface ResetPasswordFormData {
  token: string;
  password: string;
}

interface UserEntities {
  users: Record<string, User>;
}

export type UserResponse = NormalizedSchema<UserEntities, number>;
export type UsersResponse = NormalizedSchema<UserEntities, number[]>;

export const userSchema = new schema.Entity('users');

export const createUserValidator = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(EMAIL_MAX_LENGTH)
    .required(),
  password: Joi.string()
    .min(PASSWORD_MIN_LENGTH)
    .max(PASSWORD_MAX_LENGTH)
    .required(),
  isStaff: Joi.boolean(),
}).options({ abortEarly: false });

export const updateUserValidator = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(EMAIL_MAX_LENGTH)
    .required(),
  password: Joi.string()
    .min(PASSWORD_MIN_LENGTH)
    .max(PASSWORD_MAX_LENGTH)
    .allow(null, '')
    .optional(),
  isStaff: Joi.boolean(),
}).options({ abortEarly: false });

export const requestPasswordResetValidator = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(EMAIL_MAX_LENGTH)
    .required(),
}).options({ abortEarly: false });

export const resetPasswordValidator = Joi.object({
  token: Joi.string().required(),
  password: Joi.string()
    .min(PASSWORD_MIN_LENGTH)
    .max(PASSWORD_MAX_LENGTH)
    .required(),
}).options({ abortEarly: false });
