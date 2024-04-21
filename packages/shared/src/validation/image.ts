import Joi from '@hapi/joi';
import { listQuerySchema } from './common';

export const listImagesFilterSchema = Joi.object({
  search: Joi.string().allow('', null),
});

export const listImagesRequestSchema = Joi.object({
  query: listQuerySchema({
    filterSchema: listImagesFilterSchema,
    maxLimit: 100,
  }),
}).options({ abortEarly: false });
