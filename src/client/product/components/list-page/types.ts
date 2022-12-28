import { ProductsQuery, ProductsSort } from '@shared/product';

export enum ListPreset {
  BestPerformance = 'best-performance',
  BestPerformanceAmd = 'best-performance-amd',
  BestPerformanceNvidia = 'best-performance-nvidia',
  BestValue = 'best-value',
  BestValueAmd = 'best-value-amd',
  BestValueNvidia = 'best-value-nvidia',
}

export const LIST_PRESETS: Record<ListPreset, ProductsQuery> = {
  [ListPreset.BestPerformance]: {
    filter: {},
    orderBy: { sort: ProductsSort.PerformanceRating },
  },
  [ListPreset.BestPerformanceAmd]: {
    filter: { company: ['amd'] },
    orderBy: { sort: ProductsSort.PerformanceRating },
  },
  [ListPreset.BestPerformanceNvidia]: {
    filter: { company: ['nvidia'] },
    orderBy: { sort: ProductsSort.PerformanceRating },
  },
  [ListPreset.BestValue]: {
    filter: {},
    orderBy: { sort: ProductsSort.ValueRating },
  },
  [ListPreset.BestValueAmd]: {
    filter: { company: ['amd'] },
    orderBy: { sort: ProductsSort.ValueRating },
  },
  [ListPreset.BestValueNvidia]: {
    filter: { company: ['nvidia'] },
    orderBy: { sort: ProductsSort.ValueRating },
  },
};
