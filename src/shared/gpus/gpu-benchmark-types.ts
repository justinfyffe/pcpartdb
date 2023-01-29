import Joi from '@hapi/joi';

export enum BenchmarkBooleanFormatter {
  TrueFalse = 'TRUE_FALSE',
  YesNo = 'YES_NO',
}

export interface GpuBenchmarks {
  gpuId?: number;

  performanceScore?: GpuBenchmark<number>;
  valueScore?: GpuBenchmark<number>;

  g3dMark?: GpuBenchmark<number>;
  g2dMark?: GpuBenchmark<number>;
  timespyGraphics?: GpuBenchmark<number>;

  [key: string]: number | GpuBenchmark;
}

export type GpuBenchmarkKey = keyof GpuBenchmarks;

export interface GpuBenchmarkMeta {
  benchmarkKey?: GpuBenchmarkKey;
  source?: string;
}

export interface GpuBenchmark<T = unknown> {
  value?: T;
  meta?: GpuBenchmarkMeta;
}

export const gpuBenchmarkValidator = Joi.object({
  value: Joi.any().allow(null),
  source: Joi.string().allow(null),
  metadata: Joi.any().allow(null),
}).options({ abortEarly: false });

export const gpuBenchmarksValidator = Joi.object({
  performanceScore: gpuBenchmarkValidator.allow(null),
  valueScore: gpuBenchmarkValidator.allow(null),

  g3dMark: gpuBenchmarkValidator.allow(null),
  g2dMark: gpuBenchmarkValidator.allow(null),
  timespyGraphics: gpuBenchmarkValidator.allow(null),
}).options({ abortEarly: false });
