import {
  Gpu,
  GpuBenchmarks,
  GpuField,
  GpuSpecs,
  ImportGpuDataResponse,
} from '@shared/gpus';
import { createContext } from 'react';
import { ImportGpuDataResult, ImportGpuDataResults } from './import-types';

export const ImportGpuDataContext = createContext<ImportGpuDataResults>(null);

export function createImportContext(response: ImportGpuDataResponse) {
  const { gpu } = response;
  const { specs, benchmarks } = gpu;

  const importedFields: Record<string, ImportGpuDataResult<GpuField>> = {};

  ['company', 'marketSegment', 'releaseDate', 'launchPrice'].forEach((key) => {
    const value = gpu[key as keyof Gpu] as GpuField;
    importedFields[key] = { value, import: value?.value != null };
  });

  if (specs != null) {
    Object.keys(specs).forEach((key) => {
      const value = specs[key as keyof GpuSpecs];
      if (typeof value === 'number') {
        return;
      }

      importedFields[key] = { value, import: value?.value != null };
    });
  }

  if (benchmarks != null) {
    Object.keys(benchmarks).forEach((key) => {
      const value = benchmarks[key as keyof GpuBenchmarks];
      if (typeof value === 'number') {
        return;
      }

      importedFields[key] = { value, import: value?.value != null };
    });
  }

  return {
    name: { value: gpu.name, import: gpu.name != null },
    fields: importedFields,
  } as ImportGpuDataResults;
}
