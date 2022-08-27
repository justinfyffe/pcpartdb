import { NormalizedSchema, schema } from 'normalizr';

export enum CpuSpecKey {
  // CPU Specs
  ClockMultiplier = 'CLOCK_MULTIPLIER',
  ClockMultiplierUnlocked = 'CLOCK_MULTIPLIER_UNLOCKED',
  ClockSpeed = 'CLOCK_SPEED',
  ClockSpeedTurbo = 'CLOCK_SPEED_TURBO',
  Cores = 'CORES',
  L1Cache = 'L1_CACHE',
  L2Cache = 'L2_CACHE',
  L3Cache = 'L3_CACHE',
  Lithography = 'LITHOGRAPHY',
  Socket = 'SOCKET',
  TDP = 'TDP',
  Threads = 'THREADS',

  // Graphic Specs
  IntegratedGpu = 'INTEGRATED_GPU',

  // Memory Specs
  MaxMemoryBandwidth = 'MAX_MEMORY_BANDWIDTH',
  MaxMemoryChannels = 'MAX_MEMORY_CHANNELS',
  MaxMemorySize = 'MAX_MEMORY_SIZE',
  MemorySpeedDdr4 = 'MEMORY_SPEED_DDR4',
  MemorySpeedDdr5 = 'MEMORY_SPEED_DDR5',

  // Expansion Specs
}

export enum GpuSpecKey {
  // Processor
  GpuName = 'GPU_NAME',
  GpuVariant = 'GPU_VARIANT',
  Architecture = 'ARCHITECTURE',
  Foundry = 'FOUNDRY',
  Lithography = 'LITHOGRAPHY',
  Transistors = 'TRANSISTORS',
  DieSize = 'DIE_SIZE',

  // Clock Speeds
  ClockSpeed = 'CLOCK_SPEED',
  ClockSpeedTurbo = 'CLOCK_SPEED_TURBO',
  MemoryClock = 'MEMORY_CLOCK',

  // Board Design
  SlotWidth = 'SLOT_WIDTH',
  Length = 'LENGTH',
  Width = 'WIDTH',
  Height = 'HEIGHT',
  Tdp = 'TDP',
  SuggestedPsu = 'SUGGESTED_PSU',
  Outputs = 'OUTPUTS',
  PowerConnectors = 'POWER_CONNECTORS',
  BoardNumber = 'BOARD_NUMBER',

  // Theoretical Performance

  // Memory

  // Render Config

  // Graphics Features
}

export type ProductSpecKey = CpuSpecKey | GpuSpecKey;
export type ProductSpecValue = number | string;

export interface ProductSpec {
  id?: number;
  productId?: number;

  source?: string;
  key: ProductSpecKey;
  value?: ProductSpecValue;
}

export interface CpuProductSpec extends ProductSpec {
  key: CpuSpecKey;
}

export interface GpuProductSpec extends ProductSpec {
  key: GpuSpecKey;
}

interface ProductSpecEntities {
  productSpecs: Record<string, ProductSpec>;
}

export type ProductSpecsResponse = NormalizedSchema<
  ProductSpecEntities,
  number[]
>;

export const productSpecSchema = new schema.Entity('productSpecs');
