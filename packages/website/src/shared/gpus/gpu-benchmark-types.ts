import Joi from '@hapi/joi';
import { GpuField } from './gpu-field-types';

export enum BenchmarkBooleanFormatter {
  TrueFalse = 'TRUE_FALSE',
  YesNo = 'YES_NO',
}

export interface GpuBenchmarks {
  gpuId?: number;

  performanceScore?: GpuField<number>;
  valueScore?: GpuField<number>;

  g3dMark?: GpuField<number>;
  g2dMark?: GpuField<number>;
  timespyGraphics?: GpuField<number>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // [key: string]: number | GpuField<any>;
}

export const gpuBenchmarkValidator = Joi.object({
  value: Joi.any().allow(null),
  meta: Joi.any().allow(null),
}).options({ abortEarly: false });

export const gpuBenchmarksValidator = Joi.object({
  performanceScore: gpuBenchmarkValidator.allow(null),
  valueScore: gpuBenchmarkValidator.allow(null),

  g3dMark: gpuBenchmarkValidator.allow(null),
  g2dMark: gpuBenchmarkValidator.allow(null),
  timespyGraphics: gpuBenchmarkValidator.allow(null),
}).options({ abortEarly: false });
