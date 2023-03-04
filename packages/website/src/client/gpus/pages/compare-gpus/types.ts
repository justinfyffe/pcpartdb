import { Gpu } from '@pcpartdb/shared';

export interface ComparePageContentData {
  totalPerformanceRatedGpus: number;

  relativePerformanceGpus: Gpu[];
  relativeValueGpus: Gpu[];
}
