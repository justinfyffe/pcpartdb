import Joi from '@hapi/joi';

const MAX_LIMIT_GPUS_QUERY = 100;

export const listUpdatesRequestValidator = Joi.object({
  status: Joi.string(),
  offset: Joi.number().min(0),
  limit: Joi.number().positive().max(MAX_LIMIT_GPUS_QUERY),
}).options({ abortEarly: false });
