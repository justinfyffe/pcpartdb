import { GpuMarketSegmentValue } from '@pcpartdb/shared';

export interface RetailModelSource {
  name: string;
  company?: string;
  marketSegment: GpuMarketSegmentValue;
  chipsetId: number;
  techPowerUpUrl?: string;
}

export type RetailModelSources = RetailModelSource[];
