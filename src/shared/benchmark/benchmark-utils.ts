import { Benchmark, BenchmarkBooleanFormatter } from './benchmark-types';

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
