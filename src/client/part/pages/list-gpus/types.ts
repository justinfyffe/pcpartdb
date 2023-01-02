import { PartSort, PartsQuery } from '@shared/part';

export enum ListPresetSlug {
  BestPerformance = 'best-performance',
  BestPerformanceAmd = 'best-performance-amd',
  BestPerformanceNvidia = 'best-performance-nvidia',
  BestValue = 'best-value',
  BestValueAmd = 'best-value-amd',
  BestValueNvidia = 'best-value-nvidia',
}

export const LIST_PRESETS: Record<ListPresetSlug, PartsQuery> = {
  [ListPresetSlug.BestPerformance]: {
    filter: {},
    orderBy: { sort: PartSort.PerformanceRating },
  },
  [ListPresetSlug.BestPerformanceAmd]: {
    filter: { company: ['amd'] },
    orderBy: { sort: PartSort.PerformanceRating },
  },
  [ListPresetSlug.BestPerformanceNvidia]: {
    filter: { company: ['nvidia'] },
    orderBy: { sort: PartSort.PerformanceRating },
  },
  [ListPresetSlug.BestValue]: {
    filter: {},
    orderBy: { sort: PartSort.ValueRating },
  },
  [ListPresetSlug.BestValueAmd]: {
    filter: { company: ['amd'] },
    orderBy: { sort: PartSort.ValueRating },
  },
  [ListPresetSlug.BestValueNvidia]: {
    filter: { company: ['nvidia'] },
    orderBy: { sort: PartSort.ValueRating },
  },
};
