import Joi from '@hapi/joi';
import { listQueryValidator } from '@pcpartdb/shared';

const listAutomationActionsFilterValidator = Joi.object({}).options({
  abortEarly: false,
});

export const listAutomationActionsQueryValidator = listQueryValidator({
  filterValidator: listAutomationActionsFilterValidator,
  maxLimit: 100,
});

export const listAutomationActionsRequestValidator = Joi.object({
  query: listAutomationActionsQueryValidator,
}).options({ abortEarly: false });

export const createAutomationActionRequestValidator = Joi.object({
  type: Joi.string().required(),
  description: Joi.string().allow(''),

  data: Joi.any(),
  metadata: Joi.any(),

  priority: Joi.number(),
}).options({ abortEarly: false });
