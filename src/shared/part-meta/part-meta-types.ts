import Joi from '@hapi/joi';
import { PartImage } from '@shared/part-image';
import { RetailModel } from '../retail-model';

export enum PartMetaBooleanFormatter {
  TrueFalse = 'TRUE_FALSE',
  YesNo = 'YES_NO',
}

export interface PartMetas {
  // Generated Meta Values
  performanceRank?: PartMeta<number>;
  valueRank?: PartMeta<number>;

  // Persisted Meta Values
  images?: PartMeta<PartImage[]>;
  retailModels?: PartMeta<RetailModel[]>;
}

export type PartMetasRequest = PartMetas;
export type PartMetaKey = keyof PartMetas;

export interface PartMetaMetadata {
  metaKey?: PartMetaKey;
}

export interface PartMeta<T = unknown> {
  value?: T;
  source?: string;
  metadata?: PartMetaMetadata;
}

export const partMetaValidator = Joi.object({
  value: Joi.any().allow(null),
  source: Joi.string().allow(null),
  metadata: Joi.any().allow(null),
}).options({ abortEarly: false });

export const partMetasValidator = Joi.object({
  performanceRank: partMetaValidator.allow(null),
  valueRank: partMetaValidator.allow(null),

  images: partMetaValidator.allow(null),
  retailModels: partMetaValidator.allow(null),
});
