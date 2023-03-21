import { ContentTags } from '../content';
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
  relativePerformanceGpus: Gpu[];
  relativeValueGpus: Gpu[];
}

export interface CompareGpusViewModel {
  comparison: GpuComparison;
  contentData: CompareGpusContentData;
  relatedGpus: RelatedGpus;
  relatedComparisons: RelatedComparisons;
}

export interface ListGpusContentData {}

export interface ListGpusViewModel {
  query: GpusQuery;
  gpus: Gpu[];
  totalResults: number;

  contentData: ListGpusContentData;
}

export interface ViewGpuContentData {
  contentTags: ContentTags;

  totalPerformanceGpus: number;
  totalPerformanceSegmentYearGpus: number;

  relativePerformanceGpus?: Gpu[];
  relativeValueGpus?: Gpu[];

  bestPerformanceGpuForSegment?: Gpu;
  bestValueGpuForSegment?: Gpu;
}

export interface ViewGpuViewModel {
  gpu: Gpu;

  contentData: ViewGpuContentData;
  relatedGpus: RelatedGpus;
  relatedComparisons: RelatedComparisons;
}
