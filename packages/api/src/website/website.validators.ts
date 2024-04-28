import Joi from '@hapi/joi';

export const getSitemapProductSlugsValidator = Joi.object({
  productType: Joi.string().required(),
}).options({ abortEarly: false });
