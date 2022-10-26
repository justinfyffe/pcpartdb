import Joi from '@hapi/joi';

export enum ProductSpecKey {
  // General
  Company = 'COMPANY',
  MarketSegment = 'MARKET_SEGMENT',
  LaunchPriceMsrp = 'LAUNCH_PRICE_MSRP',
  ReleaseDate = 'RELEASE_DATE',

  // Processor
  GpuName = 'GPU_NAME',
  Architecture = 'ARCHITECTURE',
  ProcessSize = 'PROCESS_SIZE',
  Transistors = 'TRANSISTORS',

  // Memory
  MemorySize = 'MEMORY_SIZE',
  MemoryType = 'MEMORY_TYPE',
  MemoryClock = 'MEMORY_CLOCK',
  MemoryInterface = 'MEMORY_INTERFACE',
  MemoryBandwidth = 'MEMORY_BANDWIDTH',

  // Board Design
  SlotWidth = 'SLOT_WIDTH',
  Length = 'LENGTH',
  Width = 'WIDTH',
  Height = 'HEIGHT',
  Weight = 'WEIGHT',
  ThermalDesignPower = 'THERMAL_DESIGN_POWER',
  SuggestedPsu = 'SUGGESTED_PSU',
  BusInterface = 'BUS_INTERFACE',
  PowerConnectors = 'POWER_CONNECTORS',
  Outputs = 'OUTPUTS',

  // Cores & Clock Speeds
  ShaderUnitsCudaCores = 'SHADER_UNITS_CUDA_CORES',
  TextureMappingUnits = 'TEXTURE_MAPPING_UNIT',
  RenderOutputUnits = 'RENDER_OUTPUT_UNITS',
  TensorCores = 'TENSOR_CORES',
  RayTracingCores = 'RAY_TRACING_CORES',
  CoreClockSpeedBase = 'CORE_CLOCK_SPEED_BASE',
  CoreClockSpeedBoost = 'CORE_CLOCK_SPEED_BOOST',
  L1Cache = 'L1_CACHE',
  L2Cache = 'L2_CACHE',

  // Theoretical Performance
  PixelFillRate = 'PIXEL_FILL_RATE',
  TextureFillRate = 'TEXTURE_FILL_RATE',
  Fp32Performance = 'FP32_PERFORMANCE',
  Fp64Performance = 'FP64_PERFORMANCE',

  // API Support
  GSyncFreeSyncSupport = 'G_SYNC_FREE_SYNC_SUPPORT',
  SliCrossfireSupport = 'SLI_CROSSFIRE_SUPPORT',
  DirectXVersion = 'DIRECT_X_VERSION',
  OpenClVersion = 'OPEN_CL_VERSION',
  OpenGlVersion = 'OPEN_GL_VERSION',
  ShaderModelVersion = 'SHADER_MODEL_VERSION',
}

export interface ProductSpecMetadata {
  prefix?: string;
  suffix?: string;
}

export interface ProductSpec {
  key: ProductSpecKey;

  integerValue?: number;
  floatValue?: number;
  booleanValue?: boolean;
  stringValue?: string;
  textValue?: string;
  jsonValue?: unknown;

  source?: string;
  metadata?: ProductSpecMetadata;
}

export type ProductSpecRequest = ProductSpec;

export type ProductSpecMap = Partial<Record<ProductSpecKey, ProductSpec>>;

export const productSpecValidator = Joi.object({
  key: Joi.string().required(),

  integerValue: Joi.number().allow(null),
  floatValue: Joi.number().allow(null),
  booleanValue: Joi.boolean().allow(null),
  stringValue: Joi.string().allow(null),
  textValue: Joi.string().allow(null),
  jsonValue: Joi.any().allow(null),

  source: Joi.string().allow(null),
  metadata: Joi.any().allow(null),
}).options({ abortEarly: false });
