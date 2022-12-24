import { Product } from '@shared/product';

export interface ViewPageContentData {
  totalRatedGpus: number;

  totalYearGpus?: number;
  performanceYearGpus?: Product[];
  performanceYearRank?: number;

  totalArchitectureGpus?: number;
  performanceArchitectureGpus?: Product[];
  performanceArchitectureRank?: number;

  averagePublicationRating?: number;
}
