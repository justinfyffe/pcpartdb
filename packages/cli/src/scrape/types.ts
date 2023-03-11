import { MarketSegmentValue } from '@pcpartdb/shared';

export enum ScrapeSource {
  TechPowerUp = 'techpowerup',
  UlBenchmarks = 'ul-benchmarks',
  VideocardBenchmarks = 'videocardbenchmarks',
}

export interface GpuSourceModel {
  name?: string;
  company?: string;
  marketSegment?: MarketSegmentValue;
  g3dMark?: number;
  g2dMark?: number;
  timespyScore?: number;
  techpowerupUrl?: string;
  ulBenchmarksUrl?: string;
  videocardBenchmarksUrl?: string;
}
