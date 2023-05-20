import { ListGpusOrder, ListGpusQuery, ListGpusSort } from './gpu-types';

export const DEFAULT_LIST_GPUS_LIMIT = 50;
export const DEFAULT_LIST_GPUS_OFFSET = 0;
export const DEFAULT_LIST_GPUS_SORT = ListGpusSort.PerformanceRating;
export const DEFAULT_LIST_GPUS_ORDER = ListGpusOrder.Desc;

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

export const LIST_GPUS_PRESETS: Record<ListGpusPresetSlug, ListGpusQuery> = {
  [ListGpusPresetSlug.BestPerformance]: {
    filter: {},
    orderBy: {
      sort: ListGpusSort.PerformanceRating,
      order: ListGpusOrder.Desc,
    },
  },
  [ListGpusPresetSlug.BestPerformanceAmd]: {
    filter: { company: ['amd'] },
    orderBy: {
      sort: ListGpusSort.PerformanceRating,
      order: ListGpusOrder.Desc,
    },
  },
  [ListGpusPresetSlug.BestPerformanceNvidia]: {
    filter: { company: ['nvidia'] },
    orderBy: {
      sort: ListGpusSort.PerformanceRating,
      order: ListGpusOrder.Desc,
    },
  },
  [ListGpusPresetSlug.BestValue]: {
    filter: {},
    orderBy: { sort: ListGpusSort.ValueRating, order: ListGpusOrder.Desc },
  },
  [ListGpusPresetSlug.BestValueAmd]: {
    filter: { company: ['amd'] },
    orderBy: { sort: ListGpusSort.ValueRating, order: ListGpusOrder.Desc },
  },
  [ListGpusPresetSlug.BestValueNvidia]: {
    filter: { company: ['nvidia'] },
    orderBy: { sort: ListGpusSort.ValueRating, order: ListGpusOrder.Desc },
  },
  [ListGpusPresetSlug.Newest]: {
    filter: {},
    orderBy: { sort: ListGpusSort.ReleaseDate, order: ListGpusOrder.Desc },
  },
  [ListGpusPresetSlug.Oldest]: {
    filter: {},
    orderBy: { sort: ListGpusSort.ReleaseDate, order: ListGpusOrder.Asc },
  },
};

export const SUPPORTED_GPU_COMPANIES = [
  'acer',
  'amd',
  'asrock',
  'asus',
  'evga',
  'gainward',
  'galax',
  'gigabyte',
  'inno3d',
  'intel',
  'msi',
  'nvidia',
  'pny',
  'powercolor',
  'sapphire',
  'xfx',
  'zotac',
];
