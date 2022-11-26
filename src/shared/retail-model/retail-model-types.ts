import Joi from '@hapi/joi';

export interface RetailModel {
  name: string;

  manufacturer?: string;
  modelNumber?: string;

  price?: number;
  amazonUrl?: string;
}

export const retailModelValidator = Joi.object({
  name: Joi.string().required(),
  manufacturer: Joi.string(),
  modelNumber: Joi.string(),
  price: Joi.number(),
  amazonUrl: Joi.string(),
}).options({ abortEarly: false });
