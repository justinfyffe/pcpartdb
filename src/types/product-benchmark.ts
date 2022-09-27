import Joi from '@hapi/joi';
import { schema } from 'normalizr';

export enum ProductBenchmarkKey {
  PerformanceScore = 'PERFORMANCE_SCORE',
  ValueScore = 'VALUE_SCORE',
  Passmark = 'PASSMARK',
  TimeSpy = '3DMARK_TIME_SPY',
}

export interface ProductBenchmarkMetadata {}

export interface ProductBenchmark {
  key: ProductBenchmarkKey;

  integerValue?: number;
  floatValue?: number;
  booleanValue?: boolean;
  stringValue?: string;
  textValue?: string;
  jsonValue?: unknown;

  source?: string;
  metadata?: ProductBenchmarkMetadata;
}

export interface ProductBenchmarkRequest {
  key: ProductBenchmarkKey;

  integerValue?: number;
  floatValue?: number;
  booleanValue?: boolean;
  stringValue?: string;
  textValue?: string;
  jsonValue?: unknown;

  source?: string;
  metadata?: ProductBenchmarkMetadata;
}

export const productBenchmarkSchema = new schema.Entity('productBenchmarks');

export const productBenchmarkValidator = Joi.object({
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
