import { Benchmark, BenchmarkKey } from '@shared/benchmark';
import { Spec, SpecKey } from '@shared/spec';

export interface ImportPartDataResult<T = unknown> {
  import: boolean;
  value: T;
}

export interface ImportPartDataResults {
  name: ImportPartDataResult<string>;
  specs: Record<SpecKey, ImportPartDataResult<Spec>>;
  benchmarks: Record<BenchmarkKey, ImportPartDataResult<Benchmark>>;
}
