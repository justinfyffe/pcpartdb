import Joi from '@hapi/joi';
import { productTypeSchema } from './product';

export const getSitemapProductSlugsSchema = Joi.object({
  productType: productTypeSchema.required(),
}).options({ abortEarly: false });
