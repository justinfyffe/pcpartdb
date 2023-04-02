import Joi from '@hapi/joi';
export const autocompleteGpusRequestValidator = Joi.object({
  query: Joi.string().allow(''),
}).options({
  abortEarly: false,
});

export const autocompleteSpecsRequestValidator = Joi.object({
  key: Joi.string().required(),
  query: Joi.string().required(),
}).options({
  abortEarly: false,
});
