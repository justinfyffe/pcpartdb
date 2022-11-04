import Joi from '@hapi/joi';
import { joiValidationError } from '../api/error';

export function validate(formData: unknown, schema: Joi.ObjectSchema) {
  const validation = schema.validate(formData);
  if (validation.error) {
    throw joiValidationError(validation.error);
  }
}
