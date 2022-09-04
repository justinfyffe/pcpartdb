import { NormalizedSchema, schema } from 'normalizr';

export enum MarketSegment {
  Unknown = 'UNKNOWN',
  Desktop = 'DESKTOP',
  Laptop = 'LAPTOP',
  Server = 'SERVER',
}

export enum ProductionStatus {
  Unknown = 'UNKNOWN',
  Active = 'ACTIVE',
  EndOfLife = 'END_OF_LIFE',
  Unreleased = 'UNRELEASED',
}

export enum ProductSpecBoolean {
  Unknown = 'UNKNOWN',
  True = 'TRUE',
  False = 'FALSE',
}

export enum ProductSpecKey {
  // General
  Company = 'COMPANY',
  Generation = 'GENERATION',
  Predecessor = 'PREDECESSOR',
  Successor = 'SUCCESSOR',
  MarketSegment = 'MARKET_SEGMENT',
  LaunchPrice = 'LAUNCH_PRICE',
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
  CpuCores = 'CPU_CORES',
  Threads = 'THREADS',
  CudaCores = 'CUDA_CORES',
  Tmus = 'TMUS',
  Rops = 'ROPS',
  TensorCores = 'TENSOR_CORES',
  RtCores = 'RT_CORES',
  ClockMultiplier = 'CLOCK_MULTIPLIER',
  ClockMultiplierUnlocked = 'CLOCK_MULTIPLIER_UNLOCKED',
  ClockSpeedBase = 'CLOCK_SPEED_BASE',
  ClockSpeedBoost = 'CLOCK_SPEED_BOOST',
  L1Cache = 'L1_CACHE',
  L2Cache = 'L2_CACHE',
  L3Cache = 'L3_CACHE',
  IntegratedGpu = 'INTEGRATED_GPU',

  // Board Design
  CpuSocket = 'CPU_SOCKET',
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
  PixelFillRate = 'PIXEL_FILL_RATE',
  TextureRate = 'TEXTURE_FILL_RATE',
  Fp32Performance = 'FP32_PERFORMANCE',
  Fp64Performance = 'FP64_PERFORMANCE',

  // Memory
  MemorySize = 'MEMORY_SIZE',
  MemoryType = 'MEMORY_TYPE',
  MemoryInterface = 'MEMORY_INTERFACE',
  MemoryBandwidth = 'MEMORY_BANDWIDTH',
  MaxMemoryBandwidth = 'MAX_MEMORY_BANDWIDTH',
  MaxMemoryChannels = 'MAX_MEMORY_CHANNELS',
  MaxMemorySize = 'MAX_MEMORY_SIZE',

  // Display Connectivity
  MaxResolution = 'MAX_RESOLUTION',
  DisplayPorts = 'DISPLAY_PORTS',
  HdmiPorts = 'HDMI_PORTS',

  // API Support
  DirectXVersion = 'DIRECT_X_VERSION',
  OpenClVersion = 'OPEN_CL_VERSION',
  OpenGlVersion = 'OPEN_GL_VERSION',
  CudaVersion = 'CUDA_VERSION',
  ShaderModelVersion = 'SHADER_MODEL_VERSION',
  GSyncFreeSyncSupport = 'G_SYNC_FREE_SYNC_SUPPORT',
  SliCrossfireSupport = 'SLI_CROSSFIRE_SUPPORT',
  VrReady = 'VR_READY',
}

export interface ProductSpec {
  id?: number;
  productId?: number;

  source?: string;
  key: ProductSpecKey;
  value?: string;
}

interface ProductSpecEntities {
  productSpecs: Record<string, ProductSpec>;
}

export type ProductSpecsResponse = NormalizedSchema<
  ProductSpecEntities,
  number[]
>;

export const productSpecSchema = new schema.Entity('productSpecs');
