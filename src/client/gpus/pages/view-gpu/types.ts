import { Gpu } from '@shared/gpus';

export interface ViewPageContentData {
  totalPerformanceRatedGpus: number;

  relativePerformanceGpus?: Gpu[];
  relativeValueGpus?: Gpu[];
}
