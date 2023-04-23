import { GpuOrder, GpuSort, GpusQuery } from './gpu-types';

export const DEFAULT_LIST_GPUS_LIMIT = 50;
export const DEFAULT_LIST_GPUS_OFFSET = 0;
export const DEFAULT_LIST_GPUS_SORT = GpuSort.PerformanceRating;
export const DEFAULT_LIST_GPUS_ORDER = GpuOrder.Desc;

export enum ListGpusPresetSlug {
  BestPerformance = 'best-performance',
  BestPerformanceAmd = 'best-performance-amd',
  BestPerformanceNvidia = 'best-performance-nvidia',
  BestValue = 'best-value',
  BestValueAmd = 'best-value-amd',
  BestValueNvidia = 'best-value-nvidia',
  Newest = 'newest',
  Oldest = 'oldest',
}

export const LIST_GPUS_PRESETS: Record<ListGpusPresetSlug, GpusQuery> = {
  [ListGpusPresetSlug.BestPerformance]: {
    filter: {},
    orderBy: { sort: GpuSort.PerformanceRating, order: GpuOrder.Desc },
  },
  [ListGpusPresetSlug.BestPerformanceAmd]: {
    filter: { company: ['amd'] },
    orderBy: { sort: GpuSort.PerformanceRating, order: GpuOrder.Desc },
  },
  [ListGpusPresetSlug.BestPerformanceNvidia]: {
    filter: { company: ['nvidia'] },
    orderBy: { sort: GpuSort.PerformanceRating, order: GpuOrder.Desc },
  },
  [ListGpusPresetSlug.BestValue]: {
    filter: {},
    orderBy: { sort: GpuSort.ValueRating, order: GpuOrder.Desc },
  },
  [ListGpusPresetSlug.BestValueAmd]: {
    filter: { company: ['amd'] },
    orderBy: { sort: GpuSort.ValueRating, order: GpuOrder.Desc },
  },
  [ListGpusPresetSlug.BestValueNvidia]: {
    filter: { company: ['nvidia'] },
    orderBy: { sort: GpuSort.ValueRating, order: GpuOrder.Desc },
  },
  [ListGpusPresetSlug.Newest]: {
    filter: {},
    orderBy: { sort: GpuSort.ReleaseDate, order: GpuOrder.Desc },
  },
  [ListGpusPresetSlug.Oldest]: {
    filter: {},
    orderBy: { sort: GpuSort.ReleaseDate, order: GpuOrder.Asc },
  },
};
