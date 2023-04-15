import { Gpu, GpuField, ScrapeGpuDetailsResponse } from '@pcpartdb/shared';
import { createContext } from 'react';
import { ScrapeGpuDetailResult, ScrapeGpuDetailsResults } from './types';

export const ScrapeGpuDetailsContext =
  createContext<ScrapeGpuDetailsResults>(null);

export function createScrapeContext(response: ScrapeGpuDetailsResponse) {
  const { gpu } = response;

  const scrapedFields: Record<string, ScrapeGpuDetailResult<GpuField>> = {};
  Object.keys(gpu).forEach((key) => {
    const value = gpu[key as keyof Gpu];
    if (typeof value !== 'object') {
      return;
    } else if (!('value' in value && 'meta' in value)) {
      return;
    }

    scrapedFields[key] = { value, enabled: value?.value != null };
  });

  return {
    name: { value: gpu.name, enabled: gpu.name != null },
    fields: scrapedFields,
  } as ScrapeGpuDetailsResults;
}
