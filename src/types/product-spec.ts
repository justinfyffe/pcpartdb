import { NormalizedSchema, schema } from 'normalizr';

export enum ProductionStatus {
  Unknown = 'UNKNOWN',
  Active = 'ACTIVE',
  EndOfLife = 'END_OF_LIFE',
  Unreleased = 'UNRELEASED',
}

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
  // General
  Company = 'COMPANY',
  Generation = 'GENERATION',
  Predecessor = 'PREDECESSOR',
  Successor = 'SUCCESSOR',
  MarketSegment = 'MARKET_SEGMENT',
  MSRP = 'MSRP',
  ReleaseDate = 'RELEASE_DATE',
  ProductionStatus = 'PRODUCTION_STATUS',

  // Processor
  GpuName = 'GPU_NAME',
  GpuVariant = 'GPU_VARIANT',
  Architecture = 'ARCHITECTURE',
  Foundry = 'FOUNDRY',
  Lithography = 'LITHOGRAPHY',
  Transistors = 'TRANSISTORS',
  DieSize = 'DIE_SIZE',

  // Cores & Clock Speeds
  CudaCores = 'CUDA_CORES',
  Tmus = 'TMUS',
  Rops = 'ROPS',
  TensorCores = 'TENSOR_CORES',
  RtCores = 'RT_CORES',
  ClockSpeedBase = 'CLOCK_SPEED_BASE',
  ClockSpeedBoost = 'CLOCK_SPEED_BOOST',
  L1Cache = 'L1_CACHE',
  L2Cache = 'L2_CACHE',

  // Board Design
  SlotWidth = 'SLOT_WIDTH',
  Length = 'LENGTH',
  Width = 'WIDTH',
  Height = 'HEIGHT',
  Weight = 'WEIGHT',
  Tdp = 'TDP',
  SuggestedPsu = 'SUGGESTED_PSU',
  BusInterface = 'BUS_INTERFACE',
  PowerConnectors = 'POWER_CONNECTORS',
  BoardNumber = 'BOARD_NUMBER',

  // Theoretical Performance
  PixelRate = 'PIXEL_RATE',
  TextureRate = 'TEXTURE_RATE',
  Fp32Performance = 'FP32_PERFORMANCE',
  Fp64Performance = 'FP64_PERFORMANCE',

  // Memory
  MemorySize = 'MEMORY_SIZE',
  MemoryType = 'MEMORY_TYPE',
  MemoryInterface = 'MEMORY_INTERFACE',
  MemoryBandwidth = 'MEMORY_BANDWIDTH',

  // Display Connectivity
  MaxResolution = 'MAX_RESOLUTION',
  DisplayPorts = 'DISPLAY_PORTS',
  HdmiPorts = 'HDMI_PORTS',

  // API Support
  DirectX = 'DIRECT_X',
  OpenCl = 'OPEN_CL',
  OpenGl = 'OPEN_GL',
  Cuda = 'CUDA',
  ShaderModel = 'SHADER_MODEL',
  GSyncFreeSync = 'G_SYNC_FREE_SYNC',
  SliCrossfire = 'SLI_CROSSFIRE',
  VrReady = 'VR_READY',
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
