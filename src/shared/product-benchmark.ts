import Joi from '@hapi/joi';

export enum ProductBenchmarkBooleanFormatter {
  TrueFalse = 'TRUE_FALSE',
  YesNo = 'YES_NO',
}

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

export type ProductBenchmarkMap = Partial<
  Record<ProductBenchmarkKey, ProductBenchmark>
>;

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

export interface FormatProductBenchmarkOptions {
  decimals?: number;
  booleanFormatter?: ProductBenchmarkBooleanFormatter;
}

export function formatProductBenchmark(
  benchmark: ProductBenchmark,
  options?: FormatProductBenchmarkOptions,
) {
  if (productBenchmarkValue(benchmark) == null) {
    return '--';
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
  let returnValue = '';
  if (booleanValue != null) {
    returnValue = formatBooleanValue(
      booleanValue,
      options?.booleanFormatter ?? ProductBenchmarkBooleanFormatter.TrueFalse,
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

  // Apply modifiers

  return returnValue;
}

function formatBooleanValue(
  value: boolean,
  formatter: ProductBenchmarkBooleanFormatter,
) {
  if (formatter === ProductBenchmarkBooleanFormatter.TrueFalse) {
    return value ? 'True' : 'False';
  } else if (formatter === ProductBenchmarkBooleanFormatter.YesNo) {
    return value ? 'Yes' : 'No';
  } else {
    throw new Error(`Invalid boolean formatter: ${formatter}`);
  }
}
