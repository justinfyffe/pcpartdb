import { Gpu } from '@shared/gpus';

export interface ComparePageContentData {
  totalPerformanceRatedGpus: number;

  relativePerformanceGpus: Gpu[];
  relativeValueGpus: Gpu[];
}
