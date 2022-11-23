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

export function compareBenchmarks(
  benchmark1: Benchmark,
  benchmark2: Benchmark,
) {
  // Handle edge cases (nulls)
  if (benchmark1?.value == null && benchmark2?.value == null) {
    return 0;
  } else if (benchmark1?.value == null) {
    return -1;
  } else if (benchmark2?.value == null) {
    return 1;
  }

  // Check unsupported types
  if (benchmark1.metadata?.benchmarkKey !== benchmark2.metadata?.benchmarkKey) {
    throw new Error('Cannot compare different benchmarks');
  }

  if (typeof benchmark1.value !== typeof benchmark2.value) {
    throw new Error('Cannot compare specs of different values');
  }

  // Handle text-based comparisons
  if (
    typeof benchmark1.value === 'string' &&
    typeof benchmark2.value === 'string'
  ) {
    return benchmark1.value.localeCompare(benchmark2.value);
  }

  // Handle numberic-based comparisons
  if (
    typeof benchmark1.value === 'number' &&
    typeof benchmark2.value === 'number'
  ) {
    return benchmark1.value - benchmark2.value;
  }

  throw new Error(
    `Cannot compare benchmarks of type '${typeof benchmark2.value}'`,
  );
}

export interface FormatBenchmarkOptions {
  decimals?: number;
  booleanFormatter?: BenchmarkBooleanFormatter;
}

export function formatBenchmark(
  benchmark: Benchmark,
  options?: FormatBenchmarkOptions,
) {
  if (benchmark == null) {
    return null;
  }

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
