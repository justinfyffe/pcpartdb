import Joi from '@hapi/joi';
import { schema } from 'normalizr';

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

export enum GpuSpeckey {}

export type ProductSpecKey = CpuSpecKey | GpuSpeckey;

export interface ProductSpec<T = unknown> {
  id?: number;
  productId: number;

  source?: string;
  key: ProductSpecKey;
  value?: T;
}

export interface ProductSpecFormData {
  key: ProductSpecKey;
  value?: unknown;
  source?: string;
}

export const productSpecSchema = new schema.Entity('productSpecs');

export const createProductSpecValidator = Joi.object({
  key: Joi.string().required(),
  value: Joi.any(),
  source: Joi.string(),
}).options({ abortEarly: false });

export const updateProductSpecValidator = Joi.object({
  key: Joi.string().required(),
  value: Joi.any(),
  source: Joi.string(),
}).options({ abortEarly: false });
