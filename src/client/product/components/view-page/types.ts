import { Product } from '@shared/product';

export interface ViewPageContentData {
  totalPerformanceRatedGpus: number;

  performanceYearGpus?: Product[];
  launchYearRank?: number;

  performanceArchitectureGpus?: Product[];
  architectureRank?: number;

  averagePublicationRating?: number;
}
