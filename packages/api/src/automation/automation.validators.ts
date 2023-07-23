import Joi from '@hapi/joi';

export const enqueueAutomationRequestValidator = Joi.object({
  action: Joi.string().required(),
  description: Joi.string().allow(''),

  data: Joi.any(),
  metadata: Joi.any(),

  priority: Joi.number(),
}).options({ abortEarly: false });
