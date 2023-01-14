import { Benchmark, BenchmarkKey } from '@shared/benchmark';
import { ImportPartDataResponse } from '@shared/part';
import { Spec, SpecKey } from '@shared/spec';
import { createContext } from 'react';
import { ImportPartDataResult, ImportPartDataResults } from './import-types';

export const ImportPartDataContext = createContext<ImportPartDataResults>(null);

export function createImportContext(response: ImportPartDataResponse) {
  const { part } = response;
  const { specs, benchmarks } = part;

  const importedSpecs: Record<SpecKey, ImportPartDataResult<Spec>> = {};
  const importedBenchmarks: Record<
    BenchmarkKey,
    ImportPartDataResult<Benchmark>
  > = {};

  if (specs != null) {
    Object.keys(specs).forEach((key) => {
      const value = specs[key];
      importedSpecs[key] = { value, import: value?.value != null };
    });
  }

  if (benchmarks != null) {
    Object.keys(benchmarks).forEach((key) => {
      const value = benchmarks[key];
      importedBenchmarks[key] = { value, import: value?.value != null };
    });
  }

  return {
    name: { value: part.name, import: part.name != null },
    specs: importedSpecs,
    benchmarks: importedBenchmarks,
  } as ImportPartDataResults;
}
