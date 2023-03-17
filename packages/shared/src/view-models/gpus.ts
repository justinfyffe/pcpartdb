import {
  Gpu,
  GpuComparison,
  GpusQuery,
  RelatedComparisons,
  RelatedGpus,
} from '../gpus';

export interface AdminEditGpuViewModel {
  gpu: Gpu;
}

export interface AdminListGpusViewModel {
  gpus: Gpu[];
}

export interface CompareGpusContentData {
  totalPerformanceRatedGpus: number;

  relativePerformanceGpus: Gpu[];
  relativeValueGpus: Gpu[];
}

export interface CompareGpusViewModel {
  comparison: GpuComparison;
  contentData: CompareGpusContentData;
  relatedGpus: RelatedGpus;
  relatedComparisons: RelatedComparisons;
}

export interface ListGpusViewModel {
  query?: GpusQuery;
  totalResults: number;
  gpus: Gpu[];
  totalGpus: number;
}

export interface ViewGpuContentData {
  totalPerformanceRatedGpus: number;

  relativePerformanceGpus?: Gpu[];
  relativeValueGpus?: Gpu[];
}

export interface ViewGpuViewModel {
  gpu: Gpu;

  contentData: ViewGpuContentData;
  relatedGpus: RelatedGpus;
  relatedComparisons: RelatedComparisons;
}
