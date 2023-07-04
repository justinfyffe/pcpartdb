import {
  CpuFieldKey,
  ListCpusOrder,
  ListCpusPresetSlug,
  ListCpusQuery,
  ListCpusSort,
} from './types';

export const DEFAULT_LIST_CPUS_LIMIT = 50;
export const DEFAULT_LIST_CPUS_OFFSET = 0;
export const DEFAULT_LIST_CPUS_SORT = ListCpusSort.PerformanceRating;
export const DEFAULT_LIST_CPUS_ORDER = ListCpusOrder.Desc;

export const LIST_CPUS_PRESETS: Record<ListCpusPresetSlug, ListCpusQuery> = {
  [ListCpusPresetSlug.BestPerformance]: {
    filter: {},
    orderBy: {
      sort: ListCpusSort.PerformanceRating,
      order: ListCpusOrder.Desc,
    },
  },
  [ListCpusPresetSlug.BestPerformanceAmd]: {
    filter: { company: ['amd'] },
    orderBy: {
      sort: ListCpusSort.PerformanceRating,
      order: ListCpusOrder.Desc,
    },
  },
  [ListCpusPresetSlug.BestPerformanceIntel]: {
    filter: { company: ['intel'] },
    orderBy: {
      sort: ListCpusSort.PerformanceRating,
      order: ListCpusOrder.Desc,
    },
  },
  [ListCpusPresetSlug.BestValue]: {
    filter: {},
    orderBy: { sort: ListCpusSort.ValueRating, order: ListCpusOrder.Desc },
  },
  [ListCpusPresetSlug.BestValueAmd]: {
    filter: { company: ['amd'] },
    orderBy: { sort: ListCpusSort.ValueRating, order: ListCpusOrder.Desc },
  },
  [ListCpusPresetSlug.BestValueIntel]: {
    filter: { company: ['intel'] },
    orderBy: { sort: ListCpusSort.ValueRating, order: ListCpusOrder.Desc },
  },
  [ListCpusPresetSlug.Newest]: {
    filter: {},
    orderBy: { sort: ListCpusSort.ReleaseDate, order: ListCpusOrder.Desc },
  },
  [ListCpusPresetSlug.Oldest]: {
    filter: {},
    orderBy: { sort: ListCpusSort.ReleaseDate, order: ListCpusOrder.Asc },
  },
};

export const SUPPORTED_CPU_COMPANIES = ['amd', 'intel'];

export const CPU_FIELD_LABELS: Partial<Record<CpuFieldKey, string>> = {
  partNumber: 'Part Number',
  company: 'Company',
  marketSegments: 'Market Segments',
  launchPrice: 'Launch Price (MSRP)',
  releaseDate: 'Release Date',
  productionStatus: 'Production Status',
  bundledCooler: 'Bundled Cooler',

  socket: 'Socket',
  foundry: 'Foundry',
  processSize: 'Process Size',
  transistors: 'Transistors',
  tCaseMax: 'Tcase Max',
  tjMax: 'TJ Max',

  architecture: 'Architecture',
  codename: 'Codename',
  generation: 'Generation',
  pciExpress: 'PCI Express',
  chipsets: 'Chipsets',

  memorySupport: 'Memory Support',
  memoryChannels: 'Memory Channels',
  hasEccMemory: 'ECC Memory',

  coresCount: 'Cores',
  threadsCount: 'Threads',
  performanceCoresCount: 'Performance Cores (P-cores)',
  efficientCoresCount: 'Efficient Cores (E-cores)',
  clock: 'Clock Speed',
  turboClock: 'Turbo Clock',
  performanceCoreClock: 'P-core Clock',
  performanceCoreTurboClock: 'P-core Turbo Clock',
  efficientCoreClock: 'E-core Clock Speed',
  efficientCoreTurboClock: 'E-core Turbo Clock',
  baseClock: 'Base Clock',
  multiplier: 'Multiplier',
  isMultiplierUnlocked: 'Multiplier Unlocked',

  tdp: 'Thermal Design Power (TDP)',
  pl1: 'Power Limit 1 (PL1)',
  pl2: 'Power Limit 2 (PL2)',
  ppt: 'Package Power Tracking (PPT)',

  l1Cache: 'L1 Cache',
  l2Cache: 'L2 Cache',
  l3Cache: 'L3 Cache',
  efficientCoreL1Cache: 'E-core L1 Cache',
  efficientCoreL2Cache: 'E-core L2 Cache',

  integratedGraphics: 'Integrated Graphics',
  extensionsTechnologies: 'Extensions / Technologies',

  cpuMarkMultiThread: 'CPU Mark (Multi-thread)',
  cpuMarkSingleThread: 'CPU Mark (Single-thread)',
  geekbenchMultiCore: 'GeekBench (Multi-core)',
  geekbenchSingleCore: 'GeekBench (Single-core)',
};
