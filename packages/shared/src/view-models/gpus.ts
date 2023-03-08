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

export interface ListGpusViewModel {
  query?: GpusQuery;
  gpus: Gpu[];
  totalGpus: number;
}

export enum ListPresetSlug {
  BestPerformance = 'best-performance',
  BestPerformanceAmd = 'best-performance-amd',
  BestPerformanceNvidia = 'best-performance-nvidia',
  BestValue = 'best-value',
  BestValueAmd = 'best-value-amd',
  BestValueNvidia = 'best-value-nvidia',
}

export const LIST_PRESETS: Record<ListPresetSlug, GpusQuery> = {
  [ListPresetSlug.BestPerformance]: {
    filter: {},
    orderBy: { sort: GpuSort.PerformanceRating },
  },
  [ListPresetSlug.BestPerformanceAmd]: {
    filter: { company: ['amd'] },
    orderBy: { sort: GpuSort.PerformanceRating },
  },
  [ListPresetSlug.BestPerformanceNvidia]: {
    filter: { company: ['nvidia'] },
    orderBy: { sort: GpuSort.PerformanceRating },
  },
  [ListPresetSlug.BestValue]: {
    filter: {},
    orderBy: { sort: GpuSort.ValueRating },
  },
  [ListPresetSlug.BestValueAmd]: {
    filter: { company: ['amd'] },
    orderBy: { sort: GpuSort.ValueRating },
  },
  [ListPresetSlug.BestValueNvidia]: {
    filter: { company: ['nvidia'] },
    orderBy: { sort: GpuSort.ValueRating },
  },
};

export interface ViewGpuViewModel {
  gpu: Gpu;

  contentData: {
    totalPerformanceRatedGpus: number;

    relativePerformanceGpus?: Gpu[];
    relativeValueGpus?: Gpu[];
  };
  relatedGpus: RelatedGpus;
  relatedComparisons: RelatedComparisons;
}
