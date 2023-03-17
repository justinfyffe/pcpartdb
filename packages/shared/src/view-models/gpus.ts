import {
  Gpu,
  GpuComparison,
  GpuSort,
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

export enum ListGpusPresetSlug {
  BestPerformance = 'best-performance',
  BestPerformanceAmd = 'best-performance-amd',
  BestPerformanceNvidia = 'best-performance-nvidia',
  BestValue = 'best-value',
  BestValueAmd = 'best-value-amd',
  BestValueNvidia = 'best-value-nvidia',
}

export const LIST_GPUS_PRESETS: Record<ListGpusPresetSlug, GpusQuery> = {
  [ListGpusPresetSlug.BestPerformance]: {
    filter: {},
    orderBy: { sort: GpuSort.PerformanceRating },
  },
  [ListGpusPresetSlug.BestPerformanceAmd]: {
    filter: { company: ['amd'] },
    orderBy: { sort: GpuSort.PerformanceRating },
  },
  [ListGpusPresetSlug.BestPerformanceNvidia]: {
    filter: { company: ['nvidia'] },
    orderBy: { sort: GpuSort.PerformanceRating },
  },
  [ListGpusPresetSlug.BestValue]: {
    filter: {},
    orderBy: { sort: GpuSort.ValueRating },
  },
  [ListGpusPresetSlug.BestValueAmd]: {
    filter: { company: ['amd'] },
    orderBy: { sort: GpuSort.ValueRating },
  },
  [ListGpusPresetSlug.BestValueNvidia]: {
    filter: { company: ['nvidia'] },
    orderBy: { sort: GpuSort.ValueRating },
  },
};

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
