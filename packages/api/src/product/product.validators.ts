import Joi from '@hapi/joi';
import { listQueryValidator, ProductType } from '@pcpartdb/shared';

const listProductSourcesFilterValidator = Joi.object({
  productType: Joi.string().allow(ProductType.Cpu, ProductType.Gpu).required(),
  includeArchived: Joi.boolean(),
}).options({ abortEarly: false });

export const listProductSourcesQueryValidator = listQueryValidator({
  filterValidator: listProductSourcesFilterValidator,
  maxLimit: 25,
});

const productSourceValidator = Joi.object({
  productType: Joi.string(),
  productCompany: Joi.string().allow(null),
  productName: Joi.string(),

  sourceKey: Joi.string(),
  sourceUrl: Joi.string(),

  archived: Joi.boolean(),
}).options({ abortEarly: false });

export const createProductSourcesValidator = Joi.object({
  sources: Joi.array().allow(productSourceValidator),
}).options({ abortEarly: false });

export const createProductUpdateValidator = Joi.object({
  productType: Joi.string(),
  productCompany: Joi.string().allow(null),
  productName: Joi.string(),
  description: Joi.string().allow(null),
  status: Joi.string(),
  data: Joi.any().allow(null),
  metadata: Joi.any().allow(null),
}).options({ abortEarly: false });

export const autocompleteProductSourcesRequestValidator = Joi.object({
  productType: Joi.string().required(),
  query: Joi.string().allow(null, ''),
}).options({ abortEarly: false });

export const applyProductSourcesToProductRequestValidator = Joi.object({
  productType: Joi.string().required(),
  productId: Joi.number().required(),
  sources: Joi.array().allow(Joi.number()),
}).options({ abortEarly: false });

export const archiveProductSourcesToProductRequestValidator = Joi.object({
  sources: Joi.array().allow(Joi.number()),
}).options({ abortEarly: false });
