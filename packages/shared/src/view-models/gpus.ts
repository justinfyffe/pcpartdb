import { Gpu, GpuComparison, RelatedComparisons, RelatedGpus } from '../gpus';

export interface AdminEditGpuViewModel {
  gpu: Gpu;
}

export interface AdminListGpusViewModel {
  gpus: Gpu[];
}

export interface CompareGpusViewModel {
  comparison: GpuComparison;
  contentData: {
    totalPerformanceRatedGpus: number;

    relativePerformanceGpus: Gpu[];
    relativeValueGpus: Gpu[];
  };
  relatedGpus: RelatedGpus;
  relatedComparisons: RelatedComparisons;
}
