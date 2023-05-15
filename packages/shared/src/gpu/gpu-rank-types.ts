import { MarketSegmentValue } from './gpu-types';

export interface GpuRanks {
  performanceRank?: number;
  performanceRankForArchitectureSegment?: number;
  performanceRankForCompanySegment?: number;
  performanceRankForSegmentYear?: number;

  valueRank?: number;
  valueRankForSegment?: number;
}

export interface GpuRanksFilter {
  architecture?: string[];
  company?: string[];
  year?: number[];
  segment?: MarketSegmentValue[];

  isChipset?: boolean;
  isRetailModel?: boolean;
}

export type GpuRank = keyof GpuRanks;
