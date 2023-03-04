import { Gpu } from '@pcpartdb/shared/gpus';

export interface ViewPageContentData {
  totalPerformanceRatedGpus: number;

  relativePerformanceGpus?: Gpu[];
  relativeValueGpus?: Gpu[];
}
