import { MarketSegmentValue } from '@pcpartdb/shared';

export interface VideocardBenchmarksGpuUrl {
  name: string;
  marketSegment: MarketSegmentValue;
  g3dMark: number;
  g2dMark: number;
  url: string;
}
