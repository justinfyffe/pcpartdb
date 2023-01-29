import { BooleanFormatter, formatBooleanValue } from '@client/shared/format';
import { GpuBenchmark } from '@shared/gpus';

export interface FormatGpuBenchmarkOptions {
  decimals?: number;
  booleanFormatter?: BooleanFormatter;
}

export function formatGpuBenchmark(
  benchmark: GpuBenchmark,
  options?: FormatGpuBenchmarkOptions,
) {
  if (benchmark?.value == null) {
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
    returnValue = formatBooleanValue(value);
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
