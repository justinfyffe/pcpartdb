import Joi from '@hapi/joi';
import { ProductType } from '../product';
import { productTypeSchema } from './product';

export const preferredBenchmarksSchema = Joi.object({
  [ProductType.Cpu]: Joi.string(),
  [ProductType.Gpu]: Joi.string(),
}).options({ abortEarly: false });

export const userSettingsSchema = Joi.object({
  preferredBenchmarks: Joi.any().allow(null),
}).options({ abortEarly: false });

export const updateUserSettingsRequestSchema = Joi.object({
  settings: userSettingsSchema,

  productType: productTypeSchema.allow(null),
  productIds: Joi.array().items(Joi.number()).allow(null),
}).options({ abortEarly: false });
