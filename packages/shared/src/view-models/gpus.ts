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
  query: GpusQuery;
  gpus: Gpu[];
  totalResults: number;
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

export interface ListGpusContentData {
  trackedGpus: number;
}

export interface ListGpusViewModel {
  query: GpusQuery;
  gpus: Gpu[];
  totalResults: number;

  contentData: ListGpusContentData;
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
