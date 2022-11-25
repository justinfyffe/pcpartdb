import Joi from '@hapi/joi';

export enum BenchmarkBooleanFormatter {
  TrueFalse = 'TRUE_FALSE',
  YesNo = 'YES_NO',
}

export interface Benchmarks {
  performanceScore?: Benchmark<number>;
  valueScore?: Benchmark<number>;

  // GPU
  g3dMark?: Benchmark<number>;
  g2dMark?: Benchmark<number>;
  timeSpyGraphics?: Benchmark<number>;

  // CPU
  cpuMark?: Benchmark<number>;
  threadMark?: Benchmark<number>;
  timeSpyPhysics?: Benchmark<number>;
}

export type BenchmarksRequest = Benchmarks;
export type BenchmarkKey = keyof Benchmarks;

export interface BenchmarkMetadata {
  benchmarkKey?: BenchmarkKey;
  samples?: number;
  median?: number;
  min?: number;
  max?: number;
}

export interface Benchmark<T = unknown> {
  value?: T;
  source?: string;
  metadata?: BenchmarkMetadata;
}

export const benchmarkValidator = Joi.object({
  value: Joi.any().allow(null),
  source: Joi.string().allow(null),
  metadata: Joi.any().allow(null),
}).options({ abortEarly: false });

export const benchmarksValidator = Joi.object({
  performanceScore: benchmarkValidator.allow(null),
  valueScore: benchmarkValidator.allow(null),

  // GPU
  g3dMark: benchmarkValidator.allow(null),
  g2dMark: benchmarkValidator.allow(null),
  timeSpyGraphics: benchmarkValidator.allow(null),

  // CPU
  cpuMark: benchmarkValidator.allow(null),
  threadMark: benchmarkValidator.allow(null),
  timeSpyPhysics: benchmarkValidator.allow(null),
}).options({ abortEarly: false });
