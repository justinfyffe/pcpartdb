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

export interface BenchmarkMetadata {
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

export interface FormatBenchmarkOptions {
  decimals?: number;
  booleanFormatter?: BenchmarkBooleanFormatter;
}

export function formatBenchmark(
  benchmark: Benchmark,
  options?: FormatBenchmarkOptions,
) {
  const { value } = benchmark;
  if (value == null) {
    return null;
  }

  // Handle special cases

  // Compute string to return
  let returnValue: string = null;
  if (typeof value === 'boolean') {
    returnValue = formatBooleanValue(
      value,
      options?.booleanFormatter ?? BenchmarkBooleanFormatter.TrueFalse,
    );
  } else if (typeof value === 'number' && Number.isInteger(value)) {
    returnValue = value.toLocaleString();
  } else if (typeof value === 'number' && !Number.isInteger(value)) {
    returnValue = value.toLocaleString(undefined, {
      minimumFractionDigits: options?.decimals ?? 0,
      maximumFractionDigits: options?.decimals ?? 0,
    });
  } else if (typeof value === 'string') {
    returnValue = value;
  } else {
    return null;
  }

  if (returnValue == null) {
    return null;
  }

  // Apply modifiers

  return returnValue;
}

function formatBooleanValue(
  value: boolean,
  formatter: BenchmarkBooleanFormatter,
) {
  if (formatter === BenchmarkBooleanFormatter.TrueFalse) {
    return value ? 'True' : 'False';
  } else if (formatter === BenchmarkBooleanFormatter.YesNo) {
    return value ? 'Yes' : 'No';
  } else {
    throw new Error(`Invalid boolean formatter: ${formatter}`);
  }
}
