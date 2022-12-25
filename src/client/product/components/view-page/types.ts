import { Product } from '@shared/product';

export interface ViewPageContentData {
  totalRatedGpus: number;

  totalYearGpus?: number;
  performanceYearGpus?: Product[];
  performanceYearRank?: number;
  valueYearGpus?: Product[];
  valueYearRank?: number;

  totalArchitectureGpus?: number;
  performanceArchitectureGpus?: Product[];
  performanceArchitectureRank?: number;
  valueArchitectureGpus?: Product[];
  valueArchitectureRank?: number;
}
