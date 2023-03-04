import { Gpu } from '@pcpartdb/shared/gpus';

export interface ComparePageContentData {
  totalPerformanceRatedGpus: number;

  relativePerformanceGpus: Gpu[];
  relativeValueGpus: Gpu[];
}
