import Joi from '@hapi/joi';
import { NormalizedSchema, schema } from 'normalizr';

export enum ProductType {
  GpuModel = 'GPU_MODEL',
}

export enum ProductMetaKey {
  Description = 'DESCRIPTION',
}

export interface ProductMetaMetadata {}

export interface ProductMeta {
  key: ProductMetaKey;

  integerValue?: number;
  floatValue?: number;
  booleanValue?: boolean;
  stringValue?: string;
  textValue?: string;
  jsonValue?: unknown;

  source?: string;
  metadata?: ProductMetaMetadata;
}

export interface ProductMetaRequest {
  key: ProductMetaKey;

  integerValue?: number;
  floatValue?: number;
  booleanValue?: boolean;
  stringValue?: string;
  textValue?: string;
  jsonValue?: unknown;

  source?: string;
  metadata?: ProductMetaMetadata;
}

export const productMetaValidator = Joi.object({
  key: Joi.string().required(),

  integerValue: Joi.number().allow(null),
  floatValue: Joi.number().allow(null),
  booleanValue: Joi.boolean().allow(null),
  stringValue: Joi.string().allow(null),
  textValue: Joi.string().allow(null),
  jsonValue: Joi.any().allow(null),

  source: Joi.string().allow(null),
  metadata: Joi.any().allow(null),
}).options({ abortEarly: false });
