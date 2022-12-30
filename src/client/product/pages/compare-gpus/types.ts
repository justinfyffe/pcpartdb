import { Product } from '@shared/product';

export interface ComparePageContentData {
  totalPerformanceRatedGpus: number;

  relativePerformanceGpus: Product[];
  relativeValueGpus: Product[];
}
