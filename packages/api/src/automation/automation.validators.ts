import Joi from '@hapi/joi';
import { listQueryValidator } from '@pcpartdb/shared';

const listAutomationQueueFilterValidator = Joi.object({}).options({
  abortEarly: false,
});

export const listAutomationQueueQueryValidator = listQueryValidator({
  filterValidator: listAutomationQueueFilterValidator,
  maxLimit: 100,
});

export const listAutomationQueueRequestValidator = Joi.object({
  query: listAutomationQueueQueryValidator,
}).options({ abortEarly: false });

export const enqueueAutomationRequestValidator = Joi.object({
  action: Joi.string().required(),
  description: Joi.string().allow(''),

  data: Joi.any(),
  metadata: Joi.any(),

  priority: Joi.number(),
}).options({ abortEarly: false });
