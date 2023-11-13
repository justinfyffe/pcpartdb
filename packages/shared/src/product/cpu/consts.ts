import { ListOrder, ListSort } from '../../common';
import { CpuFieldKey, ListCpusPresetSlug, ListCpusQuery } from './types';

export const DEFAULT_LIST_CPUS_LIMIT = 50;
export const DEFAULT_LIST_CPUS_OFFSET = 0;
export const DEFAULT_LIST_CPUS_SORT = ListSort.PerformanceRating;
export const DEFAULT_LIST_CPUS_ORDER = ListOrder.Desc;

export const LIST_CPUS_PRESETS: Record<ListCpusPresetSlug, ListCpusQuery> = {
  [ListCpusPresetSlug.BestPerformance]: {
    filter: {},
    orderBy: {
      sort: ListSort.PerformanceRating,
      order: ListOrder.Desc,
    },
  },
  [ListCpusPresetSlug.BestPerformanceAmd]: {
    filter: { company: ['amd'] },
    orderBy: {
      sort: ListSort.PerformanceRating,
      order: ListOrder.Desc,
    },
  },
  [ListCpusPresetSlug.BestPerformanceIntel]: {
    filter: { company: ['intel'] },
    orderBy: {
      sort: ListSort.PerformanceRating,
      order: ListOrder.Desc,
    },
  },
  [ListCpusPresetSlug.BestValue]: {
    filter: {},
    orderBy: { sort: ListSort.PerformancePerMsrp, order: ListOrder.Desc },
  },
  [ListCpusPresetSlug.BestValueAmd]: {
    filter: { company: ['amd'] },
    orderBy: { sort: ListSort.PerformancePerMsrp, order: ListOrder.Desc },
  },
  [ListCpusPresetSlug.BestValueIntel]: {
    filter: { company: ['intel'] },
    orderBy: { sort: ListSort.PerformancePerMsrp, order: ListOrder.Desc },
  },
  [ListCpusPresetSlug.Newest]: {
    filter: {},
    orderBy: { sort: ListSort.ReleaseDate, order: ListOrder.Desc },
  },
  [ListCpusPresetSlug.Oldest]: {
    filter: {},
    orderBy: { sort: ListSort.ReleaseDate, order: ListOrder.Asc },
  },
};

export const SUPPORTED_CPU_COMPANIES = ['amd', 'intel'];

export const CPU_FIELD_LABELS: Partial<Record<CpuFieldKey, string>> = {
  partNumber: 'Part Number',
  marketSegment: 'Market Segment',
  msrp: 'Launch Price (MSRP)',
  releaseDate: 'Release Date',
  productionStatus: 'Production Status',
  bundledCooler: 'Bundled Cooler',

  socket: 'Socket',
  foundry: 'Foundry',
  processSize: 'Process Size',
  transistors: 'Transistors',
  tCaseMax: 'Tcase Max',
  tjMax: 'TJ Max',

  architecture: 'Microarchitecture',
  codename: 'Codename',
  generation: 'Series',
  pciExpress: 'PCI Express',
  chipsets: 'Chipsets',

  memorySupport: 'Memory Support',
  memoryChannels: 'Memory Channels',
  eccMemory: 'ECC Memory',

  cores: 'Cores',
  threads: 'Threads',
  pCores: 'Performance Cores (P-cores)',
  eCores: 'Efficient Cores (E-cores)',
  clock: 'Clock Speed',
  turboClock: 'Turbo Clock',
  pCoreClock: 'P-core Clock',
  pCoreTurboClock: 'P-core Turbo Clock',
  eCoreClock: 'E-core Clock Speed',
  eCoreTurboClock: 'E-core Turbo Clock',
  baseClock: 'Base Clock',
  multiplier: 'Multiplier',
  multiplierUnlocked: 'Multiplier Unlocked',

  tdp: 'Thermal Design Power (TDP)',
  pl1: 'Power Limit 1 (PL1)',
  pl2: 'Power Limit 2 (PL2)',
  ppt: 'Package Power Tracking (PPT)',

  l1Cache: 'L1 Cache',
  l2Cache: 'L2 Cache',
  l3Cache: 'L3 Cache',
  eCoreL1Cache: 'E-core L1 Cache',
  eCoreL2Cache: 'E-core L2 Cache',

  integratedGraphics: 'Integrated Graphics',
  extensionsTechnologies: 'Extensions / Technologies',
};
