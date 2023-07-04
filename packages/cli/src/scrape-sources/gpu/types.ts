import { GpuMarketSegmentValue } from '@pcpartdb/shared';

export enum ScrapeGpuSourceOption {
  TechPowerUp = 'techpowerup',
  UlBenchmarks = 'ul-benchmarks',
  VideocardBenchmarks = 'videocardbenchmarks',
}

export interface GpuSource {
  name?: string;
  company?: string;
  marketSegment?: GpuMarketSegmentValue;
  g3dMark?: number;
  g2dMark?: number;
  timespyScore?: number;
  techPowerUpUrl?: string;
  ulBenchmarksUrl?: string;
  videocardBenchmarksUrl?: string;
}

export type GpuSourceModel = GpuSource[];
