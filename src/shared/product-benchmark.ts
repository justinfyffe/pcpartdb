import Joi from '@hapi/joi';

export enum ProductBenchmarkKey {
  PerformanceScore = 'PERFORMANCE_SCORE',
  ValueScore = 'VALUE_SCORE',

  // GPU
  G3dMark = 'PASSMARK_G3D_MARK',
  G2dMark = 'PASSMARK_G2D_MARK',
  TimeSpyGraphics = '3DMARK_TIME_SPY_GRAPHICS',

  // CPU
  CpuMark = 'PASSMARK_CPU_MARK',
  ThreadMark = 'PASSMARK_THREAD_MARK',
  TimeSpyPhysics = '3DMARK_TIME_SPY_PHYSICS',
}

export interface ProductBenchmarkMetadata {
  samples?: number;
  median?: number;
  min?: number;
  max?: number;
}

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

export type ProductBenchmarkRequest = ProductBenchmark;

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

export function productBenchmarkValue(benchmark: ProductBenchmark) {
  return (
    benchmark?.booleanValue ??
    benchmark?.floatValue ??
    benchmark?.integerValue ??
    benchmark?.jsonValue ??
    benchmark?.stringValue ??
    benchmark?.textValue ??
    null
  );
}
