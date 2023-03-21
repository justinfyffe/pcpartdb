import { MarketSegmentValue } from './gpu-types';

export interface GpuRanks {
  performanceRank?: number;
  performanceRankForCompanySegment?: number;
  performanceRankForSegmentYear?: number;

  valueRank?: number;
}

export interface GpuRanksFilter {
  company?: string[];
  year?: number[];
  segment?: MarketSegmentValue[];
}

export type GpuRank = keyof GpuRanks;
