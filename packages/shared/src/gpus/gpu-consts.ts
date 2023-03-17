import { GpuSort, GpusQuery } from './gpu-types';

export const DEFAULT_LIST_GPUS_LIMIT = 10;
export const DEFAULT_LIST_GPUS_OFFSET = 0;
export const DEFAULT_LIST_GPUS_SORT = GpuSort.PerformanceRating;

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
