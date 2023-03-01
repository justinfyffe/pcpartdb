import { GpuField } from '@pcpartdb/website/shared/gpus';

export interface ImportGpuDataResult<T = unknown> {
  import: boolean;
  value: T;
}

export interface ImportGpuDataResults {
  name: ImportGpuDataResult<string>;
  fields: Record<string, ImportGpuDataResult<GpuField>>;
}
