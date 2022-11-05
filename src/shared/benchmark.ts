import Joi from '@hapi/joi';

export enum BenchmarkBooleanFormatter {
  TrueFalse = 'TRUE_FALSE',
  YesNo = 'YES_NO',
}

export enum BenchmarkKey {
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

export interface BenchmarkMetadata {
  samples?: number;
  median?: number;
  min?: number;
  max?: number;
}

export interface Benchmark {
  key: BenchmarkKey;

  integerValue?: number;
  floatValue?: number;
  booleanValue?: boolean;
  stringValue?: string;
  textValue?: string;
  jsonValue?: unknown;

  source?: string;
  metadata?: BenchmarkMetadata;
}

export type BenchmarkRequest = Benchmark;

export type BenchmarkMap = Partial<Record<BenchmarkKey, Benchmark>>;

export const benchmarkValidator = Joi.object({
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

export function getBenchmarkValue(benchmark: Benchmark) {
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

export interface FormatBenchmarkOptions {
  decimals?: number;
  booleanFormatter?: BenchmarkBooleanFormatter;
}

export function formatBenchmark(
  benchmark: Benchmark,
  options?: FormatBenchmarkOptions,
) {
  if (getBenchmarkValue(benchmark) == null) {
    return null;
  }

  const {
    booleanValue,
    floatValue,
    integerValue,
    jsonValue,
    stringValue,
    textValue,
  } = benchmark;

  // Handle special cases

  // Handle cases that we cannot output.
  if (jsonValue != null) {
    throw new Error('Cannot format a json value');
  }

  // Compute string to return
  let returnValue = null;
  if (booleanValue != null) {
    returnValue = formatBooleanValue(
      booleanValue,
      options?.booleanFormatter ?? BenchmarkBooleanFormatter.TrueFalse,
    );
  } else if (floatValue != null) {
    returnValue = floatValue.toLocaleString(undefined, {
      minimumFractionDigits: options?.decimals ?? 0,
      maximumFractionDigits: options?.decimals ?? 0,
    });
  } else if (integerValue != null) {
    returnValue = integerValue.toLocaleString();
  } else if (stringValue != null) {
    returnValue = stringValue;
  } else if (textValue != null) {
    returnValue = textValue;
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
