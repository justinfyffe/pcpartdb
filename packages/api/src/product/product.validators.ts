import Joi from '@hapi/joi';
import { listQueryValidator, ProductType } from '@pcpartdb/shared';

// Product Sources

const listProductSourcesFilterValidator = Joi.object({
  productType: Joi.string().allow(ProductType.Cpu, ProductType.Gpu).required(),
  includeArchived: Joi.boolean(),
  search: Joi.string(),
}).options({ abortEarly: false });

export const listProductSourcesQueryValidator = listQueryValidator({
  filterValidator: listProductSourcesFilterValidator,
  maxLimit: 25,
});

export const listProductSourcesRequestValidator = Joi.object({
  query: listProductSourcesQueryValidator,
}).options({ abortEarly: false });

const productSourceValidator = Joi.object({
  productType: Joi.string(),
  productCompany: Joi.string().allow(null),
  productName: Joi.string(),

  sourceKey: Joi.string(),
  sourceUrl: Joi.string(),

  archived: Joi.boolean(),
}).options({ abortEarly: false });

export const upsertProductSourcesValidator = Joi.object({
  sources: Joi.array().allow(productSourceValidator),
}).options({ abortEarly: false });

export const autocompleteProductSourcesRequestValidator = Joi.object({
  productType: Joi.string().required(),
  source: Joi.string().allow(null, ''),
  query: Joi.string().allow(null, ''),
}).options({ abortEarly: false });

export const applyProductSourcesToProductRequestValidator = Joi.object({
  productType: Joi.string().required(),
  productId: Joi.number().required(),
  sources: Joi.array().allow(Joi.number()),
}).options({ abortEarly: false });

// Product Updates

const listProductUpdatesFilterValidator = Joi.object({
  productType: Joi.string().allow(ProductType.Cpu, ProductType.Gpu).required(),
  status: Joi.string(),
  search: Joi.string(),
}).options({ abortEarly: false });

export const listProductUpdatesQueryValidator = listQueryValidator({
  filterValidator: listProductUpdatesFilterValidator,
  maxLimit: 25,
});

export const listProductUpdatesRequestValidator = Joi.object({
  query: listProductUpdatesQueryValidator,
}).options({ abortEarly: false });

export const createProductUpdateRequestValidator = Joi.object({
  productType: Joi.string(),
  productCompany: Joi.string().allow(null),
  productName: Joi.string(),
  description: Joi.string().allow(null),
  status: Joi.string(),
  data: Joi.any().allow(null),
  metadata: Joi.any().allow(null),

  cpuId: Joi.number().allow(null),
  gpuId: Joi.number().allow(null),
}).options({ abortEarly: false });

export const approveProductUpdateRequestValidator = Joi.object({
  slug: Joi.string().allow(null),
}).options({ abortEarly: false });

export const rejectProductUpdateRequestValidator = Joi.object({}).options({
  abortEarly: false,
});
