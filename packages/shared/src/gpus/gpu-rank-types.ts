export interface GpuRanks {
  performanceRank?: number;
  performanceCompanyRank?: number;
  performanceYearRank?: number;

  valueRank?: number;
}

export interface GpuRanksFilter {
  company?: string[];
  year?: number[];
}

export type GpuRank = keyof GpuRanks;
