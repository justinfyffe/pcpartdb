import {
  Gpu,
  GpuBenchmarks,
  GpuField,
  GpuSpecs,
  ScrapeGpuDetailsResponse,
} from '@pcpartdb/shared';
import { createContext } from 'react';
import { ScrapeGpuDetailResult, ScrapeGpuDetailsResults } from './scrape-types';

export const ScrapeGpuDetailsContext =
  createContext<ScrapeGpuDetailsResults>(null);

export function createScrapeContext(response: ScrapeGpuDetailsResponse) {
  const { gpu } = response;
  const { specs, benchmarks } = gpu;

  const scrapedFields: Record<string, ScrapeGpuDetailResult<GpuField>> = {};

  ['company', 'marketSegment', 'releaseDate', 'launchPrice'].forEach((key) => {
    const value = gpu[key as keyof Gpu] as GpuField;
    scrapedFields[key] = { value, enabled: value?.value != null };
  });

  if (specs != null) {
    Object.keys(specs).forEach((key) => {
      const value = specs[key as keyof GpuSpecs];
      if (typeof value === 'number') {
        return;
      }

      scrapedFields[key] = { value, enabled: value?.value != null };
    });
  }

  if (benchmarks != null) {
    Object.keys(benchmarks).forEach((key) => {
      const value = benchmarks[key as keyof GpuBenchmarks];
      if (typeof value === 'number') {
        return;
      }

      scrapedFields[key] = { value, enabled: value?.value != null };
    });
  }

  return {
    name: { value: gpu.name, enabled: gpu.name != null },
    fields: scrapedFields,
  } as ScrapeGpuDetailsResults;
}
