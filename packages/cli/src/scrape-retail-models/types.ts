import { MarketSegmentValue } from '@pcpartdb/shared';

export interface RetailModelSource {
  name: string;
  company?: string;
  marketSegment: MarketSegmentValue;
  chipsetId: number;
  techPowerUpUrl?: string;
}

export type RetailModelSources = RetailModelSource[];
