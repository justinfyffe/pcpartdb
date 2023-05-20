import {
  Gpu,
  GpuComparison,
  ListGpusQuery,
  ListGpusResponse,
  RelatedComparisons,
  RelatedGpus,
} from '../gpu';

export interface AdminEditGpuViewModel {
  gpu: Gpu;
}

export interface AdminListGpusViewModel {
  query: ListGpusQuery;
  gpus: Gpu[];
  totalResults: number;
}

export interface CompareGpusContentData {
  relativePerformanceGpus: Gpu[];
  relativeValueGpus: Gpu[];

  retailModels1?: Gpu[];
  retailModels2?: Gpu[];
}

export interface CompareGpusViewModel {
  comparison: GpuComparison;
  contentData: CompareGpusContentData;
  relatedGpus: RelatedGpus;
  relatedComparisons: RelatedComparisons;
}

export interface ListGpusViewModel extends ListGpusResponse {}

export interface ViewGpuContentData {
  totalPerformanceGpus: number;
  totalPerformanceSegmentYearGpus: number;

  relativePerformanceGpus?: Gpu[];
  relativeValueGpus?: Gpu[];

  bestPerformanceGpuForSegment?: Gpu;
  bestValueGpuForSegment?: Gpu;

  retailModels?: Gpu[];
}

export interface ViewGpuViewModel {
  gpu: Gpu;

  contentData: ViewGpuContentData;
  relatedGpus: RelatedGpus;
  relatedComparisons: RelatedComparisons;
}
