import Joi from '@hapi/joi';
import { RetailModel } from '../retail-model';

export enum ProductMetaBooleanFormatter {
  TrueFalse = 'TRUE_FALSE',
  YesNo = 'YES_NO',
}

export interface ProductMetas {
  // Generated Meta Values
  performanceRank?: ProductMeta<number>;
  valueRank?: ProductMeta<number>;

  // Persisted Meta Values
  description?: ProductMeta<string>;
  retailModels?: ProductMeta<RetailModel[]>;
}

export type ProductMetasRequest = ProductMetas;
export type ProductMetaKey = keyof ProductMetas;

export interface ProductMetaMetadata {
  metaKey?: ProductMetaKey;
}

export interface ProductMeta<T = unknown> {
  value?: T;
  source?: string;
  metadata?: ProductMetaMetadata;
}

export const productMetaValidator = Joi.object({
  value: Joi.any().allow(null),
  source: Joi.string().allow(null),
  metadata: Joi.any().allow(null),
}).options({ abortEarly: false });

export const productMetasValidator = Joi.object({
  performanceRank: productMetaValidator.allow(null),
  valueRank: productMetaValidator.allow(null),

  description: productMetaValidator.allow(null),
  retailModels: productMetaValidator.allow(null),
});
