import {
  MarketSegment,
  ProductField,
  ProductFieldMeta,
  ProductionStatus,
} from './common';

// Types

export type CpuFieldKey = keyof Omit<CpuFields, 'id' | 'productId'>;

export interface CpuField<T = unknown> extends ProductField<T> {
  meta?: CpuFieldMeta;
}
export interface CpuFieldMeta extends ProductFieldMeta {
  fieldKey?: CpuFieldKey;
}

export interface CpuFields {
  id?: number;
  productId?: number;

  architecture?: CpuField<string>;
  baseClock?: CpuField<number>;
  bundledCooler?: CpuField<string>;
  chipsets?: CpuField<string>;
  clock?: CpuField<number>;
  codename?: CpuField<string>;
  cores?: CpuField<number>;
  dieSize?: CpuField<number>;
  eccMemory?: CpuField<boolean>;
  eCores?: CpuField<number>; // Efficient Cores
  eCoreClock?: CpuField<number>; // Efficient Cores Clock
  eCoreL1Cache?: CpuField<number>; // Efficient Core L1 Cache
  eCoreL2Cache?: CpuField<number>; // Efficient Core L2 Cache
  eCoreTurboClock?: CpuField<number>; // Efficient Cores Turbo Clock
  extensionsTechnologies?: CpuField<string>;
  foundry?: CpuField<string>;
  generation?: CpuField<string>;
  integratedGraphics?: CpuField<string>;
  l1Cache?: CpuField<number>;
  l2Cache?: CpuField<number>;
  l3Cache?: CpuField<number>;
  marketSegment?: CpuField<MarketSegment>;
  memoryChannels?: CpuField<number>;
  memorySupport?: CpuField<string>; // Example: DDR4-3200, DDR5-5600
  msrp?: CpuField<number>;
  multiplier?: CpuField<number>;
  multiplierUnlocked?: CpuField<boolean>;
  partNumber?: CpuField<string>;
  pciExpress?: CpuField<string>; // Example: PCIe 4.0 x4, PCIe 5.0 x16
  pCores?: CpuField<number>; // Performance Cores
  pCoreClock?: CpuField<number>; // Performance Cores Clock
  pCoreTurboClock?: CpuField<number>; // Performance Cores Turbo Clock
  pl1?: CpuField<number>; // Power Level 1 - stock (marketed) power state
  pl2?: CpuField<number>; // Power Level 2 - Power state when CPU uses turbo frequencies.
  ppt?: CpuField<number>; // Package Power Tracking - Measurement of power to the CPU Socket on the mobo
  processSize?: CpuField<number>;
  productionStatus?: CpuField<ProductionStatus>;
  releaseDate?: CpuField<string>;
  smp?: CpuField<number>; // Symmetric Multiprocessing
  socket?: CpuField<string>;
  tCaseMax?: CpuField<number>; // Max case temperature
  tdp?: CpuField<number>;
  threads?: CpuField<number>;
  tjMax?: CpuField<number>; // Max core temperature
  transistors?: CpuField<number>;
  turboClock?: CpuField<number>;

  metadata?: CpuFieldsMeta;
}
export interface CpuFieldsMeta {}

// Consts

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

// Utils

export function convertToCpuMemoryChannelText(memoryChannel: number) {
  if (memoryChannel == null) {
    return null;
  }

  switch (memoryChannel) {
    case 1:
      return 'Single-channel';
    case 2:
      return 'Dual-channel';
    case 3:
      return 'Triple-channel';
    case 4:
      return 'Quad-channel';
    case 6:
      return 'Hexa-channel';
    case 8:
      return 'Octa-channel';
    case 12:
      return 'Twelve-channel';
    default:
      return null;
  }
}

export function convertToCpuMemoryChannelNumber(memoryChannel: string) {
  if (memoryChannel == null) {
    return null;
  }

  const lcValue = memoryChannel.toLowerCase();
  switch (lcValue) {
    case 'single-channel':
    case 'one-channel':
      return 1;
    case 'dual-channel':
    case 'two-channel':
      return 2;
    case 'triple-channel':
    case 'three-channel':
      return 3;
    case 'quad-channel':
    case 'four-channel':
      return 4;
    case 'six-channel':
    case 'hexa-channel':
      return 6;
    case 'octa-channel':
    case 'eight-channel':
      return 8;
    case 'twelve-channel':
      return 12;
    default:
      return null;
  }
}
