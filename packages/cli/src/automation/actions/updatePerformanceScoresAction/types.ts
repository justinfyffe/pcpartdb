import { BenchmarKey } from '@pcpartdb/shared';

export type BenchmarkEstimates = Record<
  number,
  Partial<Record<BenchmarKey, number>>
>;

export type BenchmarkMaxes = Partial<Record<BenchmarKey, number>>;

export type BenchmarkWeights = Partial<Record<BenchmarKey, number>>;
