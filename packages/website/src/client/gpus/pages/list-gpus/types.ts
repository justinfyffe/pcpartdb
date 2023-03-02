import { GpuSort, GpusQuery } from '@pcpartdb/database';

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
