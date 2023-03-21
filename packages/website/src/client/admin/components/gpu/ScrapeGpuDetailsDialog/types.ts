import { GpuField } from '@pcpartdb/shared';

export interface ScrapeGpuDetailResult<T = unknown> {
  enabled: boolean;
  value: T;
}

export interface ScrapeGpuDetailsResults {
  name: ScrapeGpuDetailResult<string>;
  fields: Record<string, ScrapeGpuDetailResult<GpuField>>;
}
