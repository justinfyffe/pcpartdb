import Joi from '@hapi/joi';
import {
  EMAIL_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
} from '@pcpartdb/website/shared/user';

export const loginRequestValidator = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(EMAIL_MAX_LENGTH)
    .required(),
  password: Joi.string().max(PASSWORD_MAX_LENGTH).required(),
  remember: Joi.boolean(),
}).options({ abortEarly: false });
