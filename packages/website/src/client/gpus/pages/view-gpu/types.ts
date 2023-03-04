import { Gpu } from '@pcpartdb/shared';

export interface ViewPageContentData {
  totalPerformanceRatedGpus: number;

  relativePerformanceGpus?: Gpu[];
  relativeValueGpus?: Gpu[];
}
