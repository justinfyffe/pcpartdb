import {
  Gpu,
  GpuComparison,
  ListGpusResponse,
  RelatedGpuComparisons,
  RelatedGpus,
} from '../product';

export interface AdminEditGpuViewModel {
  gpu: Gpu;
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
  relatedComparisons: RelatedGpuComparisons;
}

export interface ListGpusViewModel extends ListGpusResponse {}

export interface ViewGpuContentData {
  totalPerformanceGpus: number;

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
  relatedComparisons: RelatedGpuComparisons;
}
