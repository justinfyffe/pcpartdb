import { GpuMarketSegmentValue } from '@pcpartdb/shared';

export interface VideocardBenchmarksGpuSource {
  name: string;
  company: string;
  marketSegment: GpuMarketSegmentValue;
  g3dMark: number;
  g2dMark: number;
  url: string;
}
