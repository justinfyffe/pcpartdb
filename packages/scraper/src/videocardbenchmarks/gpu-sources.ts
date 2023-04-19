import { MarketSegmentValue } from '@pcpartdb/shared';

export interface VideocardBenchmarksGpuSource {
  name: string;
  company: string;
  marketSegment: MarketSegmentValue;
  g3dMark: number;
  g2dMark: number;
  url: string;
}
