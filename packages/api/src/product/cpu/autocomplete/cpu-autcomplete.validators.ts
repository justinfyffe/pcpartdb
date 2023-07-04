import Joi from '@hapi/joi';
export const autocompleteCpusRequestValidator = Joi.object({
  query: Joi.string().allow(''),
}).options({
  abortEarly: false,
});

export const autocompleteCpuDataRequestValidator = Joi.object({
  key: Joi.string().required(),
  query: Joi.string().required(),
}).options({
  abortEarly: false,
});
