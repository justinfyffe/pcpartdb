import {
  GpuBenchmark,
  GpuBenchmarkKey,
  GpuSpec,
  GpuSpecKey,
} from '@shared/gpus';

export interface ImportGpuDataResult<T = unknown> {
  import: boolean;
  value: T;
}

export interface ImportGpuDataResults {
  name: ImportGpuDataResult<string>;
  specs: Record<GpuSpecKey, ImportGpuDataResult<GpuSpec>>;
  benchmarks: Record<GpuBenchmarkKey, ImportGpuDataResult<GpuBenchmark>>;
}
