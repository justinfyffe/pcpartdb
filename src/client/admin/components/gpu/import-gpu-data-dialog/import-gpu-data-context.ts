import {
  GpuBenchmark,
  GpuBenchmarkKey,
  GpuSpec,
  GpuSpecKey,
  ImportGpuDataResponse,
} from '@shared/gpus';
import { createContext } from 'react';
import { ImportGpuDataResult, ImportGpuDataResults } from './import-types';

export const ImportGpuDataContext = createContext<ImportGpuDataResults>(null);

export function createImportContext(response: ImportGpuDataResponse) {
  const { gpu } = response;
  const { specs, benchmarks } = gpu;

  const importedSpecs: Record<GpuSpecKey, ImportGpuDataResult<GpuSpec>> = {};
  const importedBenchmarks: Record<
    GpuBenchmarkKey,
    ImportGpuDataResult<GpuBenchmark>
  > = {};

  if (specs != null) {
    Object.keys(specs).forEach((key) => {
      const value = specs[key];
      if (typeof value === 'number') {
        return;
      }

      importedSpecs[key] = { value, import: value?.value != null };
    });
  }

  if (benchmarks != null) {
    Object.keys(benchmarks).forEach((key) => {
      const value = benchmarks[key];
      if (typeof value === 'number') {
        return;
      }

      importedBenchmarks[key] = { value, import: value?.value != null };
    });
  }

  return {
    name: { value: gpu.name, import: gpu.name != null },
    specs: importedSpecs,
    benchmarks: importedBenchmarks,
  } as ImportGpuDataResults;
}
