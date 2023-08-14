import Joi from '@hapi/joi';

export const getSitemapProductSlugsValidator = Joi.object({
  productType: Joi.string().required(),
  gpuProductType: Joi.string(),
}).options({ abortEarly: false });
