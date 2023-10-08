import Joi from '@hapi/joi';
import { listQuerySchema } from './common';
import { productTypeSchema } from './product';

export const productSourceKeySchema = Joi.string();

export const automationSourceSchema = Joi.object({
  id: Joi.number().allow(null),

  groupKey: Joi.string(),
  productType: productTypeSchema,
  sourceKey: Joi.string(),
  externalKey: Joi.string(),

  sourceName: Joi.string(),
  sourceUrl: Joi.string(),

  archived: Joi.boolean().allow(null),

  relatedProductId: Joi.number().allow(null),
  relatedProduct: Joi.any().allow(null),
});

export const updateAutomationStatusSchema = Joi.object({
  enabled: Joi.boolean().required(),
}).options({ abortEarly: false });

export const listAutomationActionsRequestSchema = Joi.object({
  query: listQuerySchema({
    filterSchema: Joi.object({
      type: Joi.string().required(),
      description: Joi.string().allow('', null),

      data: Joi.any().allow(null),
      metadata: Joi.any().allow(null),

      priority: Joi.number().allow(null),
    }),
    maxLimit: 100,
  }),
}).options({ abortEarly: false });

export const createAutomationActionRequestSchema = Joi.object({
  type: Joi.string().required(),
  description: Joi.string().allow(''),

  data: Joi.any(),
  metadata: Joi.any(),

  priority: Joi.number(),
}).options({ abortEarly: false });

export const listAutomationSourcesRequestSchema = Joi.object({
  query: listQuerySchema({
    filterSchema: Joi.object({
      productType: productTypeSchema.required(),
      includeArchived: Joi.boolean().allow(null),
      search: Joi.string().allow('', null),

      relatedProductId: Joi.number().allow(null),
      isParent: Joi.boolean().allow(null),
      isChild: Joi.boolean().allow(null),
    }),
    maxLimit: 100,
  }),
}).options({ abortEarly: false });

export const autocompleteAutomationSourcesRequestSchema = Joi.object({
  productType: productTypeSchema,
  source: productSourceKeySchema.allow(null),
  query: Joi.string().allow('', null),
}).options({ abortEarly: false });

export const upsertAutomationSourcesRequestSchema = Joi.object({
  sources: Joi.array().items(automationSourceSchema),
  autoArchive: Joi.boolean().allow(null),
}).options({ abortEarly: false });

export const applyAutomationSourcesToProductRequestSchema = Joi.object({
  productType: productTypeSchema.required(),
  productId: Joi.number().required(),
  sources: Joi.array().items(Joi.number()),
}).options({ abortEarly: false });
