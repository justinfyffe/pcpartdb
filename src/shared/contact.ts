import Joi from '@hapi/joi';

export const NAME_MAX_LENGTH = 250;
export const EMAIL_MAX_LENGTH = 250;
export const URL_MAX_LENGTH = 1000;
export const SUBJECT_MAX_LENGTH = 250;
export const MESSAGE_MAX_LENGTH = 1000;

export interface ContactRequest {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export const contactValidator = Joi.object({
  name: Joi.string().max(NAME_MAX_LENGTH).required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(EMAIL_MAX_LENGTH)
    .required(),
  subject: Joi.string().max(SUBJECT_MAX_LENGTH).allow('', null),
  message: Joi.string().max(MESSAGE_MAX_LENGTH).required(),
}).options({ abortEarly: false });
