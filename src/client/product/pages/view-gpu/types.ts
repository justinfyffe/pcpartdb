import { Product } from '@shared/product';

export interface ViewPageContentData {
  totalPerformanceRatedGpus: number;

  performanceYearGpus?: Product[];
  performanceYearRank?: number;
  performanceArchitectureGpus?: Product[];
  performanceArchitectureRank?: number;

  valueYearGpus?: Product[];
  valueYearRank?: number;
  valueArchitectureGpus?: Product[];
  valueArchitectureRank?: number;
}
