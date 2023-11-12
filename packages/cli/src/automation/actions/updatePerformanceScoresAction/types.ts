import { BenchmarkKey } from '@pcpartdb/shared';

export type BenchmarkEstimates = Record<
  number,
  Partial<Record<BenchmarkKey, number>>
>;

export type BenchmarkMaxes = Partial<Record<BenchmarkKey, number>>;

export type BenchmarkWeights = Partial<Record<BenchmarkKey, number>>;
