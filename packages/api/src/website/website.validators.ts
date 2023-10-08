import Joi from '@hapi/joi';

export const getSitemapProductSlugsValidator = Joi.object({
  productType: Joi.string().required(),
  hasParent: Joi.boolean(),
}).options({ abortEarly: false });
