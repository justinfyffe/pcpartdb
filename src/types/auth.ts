import Joi from '@hapi/joi';
import { EMAIL_MAX_LENGTH, PASSWORD_MAX_LENGTH, User } from './user';

export interface AccessToken {
  token: string;
  user: User;
}

export interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

export const loginValidator = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(EMAIL_MAX_LENGTH)
    .required(),
  password: Joi.string().max(PASSWORD_MAX_LENGTH).required(),
  remember: Joi.boolean(),
}).options({ abortEarly: false });
