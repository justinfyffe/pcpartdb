import { ProductsQuery, ProductsSort } from '@shared/product';

export enum ListPresetSlug {
  BestPerformance = 'best-performance',
  BestPerformanceAmd = 'best-performance-amd',
  BestPerformanceNvidia = 'best-performance-nvidia',
  BestValue = 'best-value',
  BestValueAmd = 'best-value-amd',
  BestValueNvidia = 'best-value-nvidia',
}

export const LIST_PRESETS: Record<ListPresetSlug, ProductsQuery> = {
  [ListPresetSlug.BestPerformance]: {
    filter: {},
    orderBy: { sort: ProductsSort.PerformanceRating },
  },
  [ListPresetSlug.BestPerformanceAmd]: {
    filter: { company: ['amd'] },
    orderBy: { sort: ProductsSort.PerformanceRating },
  },
  [ListPresetSlug.BestPerformanceNvidia]: {
    filter: { company: ['nvidia'] },
    orderBy: { sort: ProductsSort.PerformanceRating },
  },
  [ListPresetSlug.BestValue]: {
    filter: {},
    orderBy: { sort: ProductsSort.ValueRating },
  },
  [ListPresetSlug.BestValueAmd]: {
    filter: { company: ['amd'] },
    orderBy: { sort: ProductsSort.ValueRating },
  },
  [ListPresetSlug.BestValueNvidia]: {
    filter: { company: ['nvidia'] },
    orderBy: { sort: ProductsSort.ValueRating },
  },
};
