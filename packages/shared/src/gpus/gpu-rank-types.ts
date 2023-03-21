import { MarketSegmentValue } from './gpu-types';

export interface GpuRanks {
  performanceRank?: number;
  performanceSegmentCompanyRank?: number;
  performanceSegmentYearRank?: number;

  valueRank?: number;
}

export interface GpuRanksFilter {
  company?: string[];
  year?: number[];
  segment?: MarketSegmentValue[];
}

export type GpuRank = keyof GpuRanks;
