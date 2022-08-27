import { NormalizedSchema, schema } from 'normalizr';

export enum CpuSpecKey {
  // General
  Company = 'COMPANY',
  Architecture = 'ARCHITECTURE',
  Generation = 'GENERATION',
  MarketSegment = 'MARKET_SEGMENT',
  MSRP = 'MSRP',
  ReleaseDate = 'RELEASE_DATE',
  Status = 'STATUS',

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

export enum GpuSpecKey {}

export type ProductSpecKey = CpuSpecKey | GpuSpecKey;
export type ProductSpecValue = number | string | object;

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
