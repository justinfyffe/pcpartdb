import { Gpu } from '@pcpartdb/website/shared/gpus';

export interface ComparePageContentData {
  totalPerformanceRatedGpus: number;

  relativePerformanceGpus: Gpu[];
  relativeValueGpus: Gpu[];
}
