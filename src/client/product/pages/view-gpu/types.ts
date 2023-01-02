import { Product } from '@shared/product';

export interface ViewPageContentData {
  totalPerformanceRatedGpus: number;

  relativePerformanceGpus?: Product[];
  relativeValueGpus?: Product[];
}
