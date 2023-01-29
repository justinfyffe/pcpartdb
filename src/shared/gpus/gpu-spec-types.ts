import Joi from '@hapi/joi';

export enum MarketSegmentValue {
  Desktop = 'DESKTOP',
  Laptop = 'LAPTOP',
  Server = 'SERVER',
}

export interface GpuSpecs {
  gpuId?: number;

  // General
  company?: GpuSpec<string>;
  marketSegment?: GpuSpec<MarketSegmentValue>;
  launchPrice?: GpuSpec<number>;
  releaseDate?: GpuSpec<string>;

  // Processor
  gpuCodename?: GpuSpec<string>;
  architecture?: GpuSpec<string>;
  processSize?: GpuSpec<number>;
  transistors?: GpuSpec<number>;

  // Memory
  memorySize?: GpuSpec<number>;
  memoryType?: GpuSpec<string>;
  memoryClock?: GpuSpec<number>;
  memoryInterface?: GpuSpec<number>;
  memoryBandwidth?: GpuSpec<number>;

  // Board Design
  slotWidth?: GpuSpec<number>;
  length?: GpuSpec<number>;
  width?: GpuSpec<number>;
  height?: GpuSpec<number>;
  weight?: GpuSpec<number>;
  thermalDesignPower?: GpuSpec<number>;
  suggestedPsu?: GpuSpec<number>;
  busInterface?: GpuSpec<string>;
  powerConnectors?: GpuSpec<string>;
  outputs?: GpuSpec<string>;

  // Cores & Clock Speeds
  shaderUnitsCudaCores?: GpuSpec<number>;
  textureMappingUnits?: GpuSpec<number>;
  renderOutputUnits?: GpuSpec<number>;
  tensorCores?: GpuSpec<number>;
  rayTracingCores?: GpuSpec<number>;
  coreClockSpeedBase?: GpuSpec<number>;
  coreClockSpeedBoost?: GpuSpec<number>;
  l1Cache?: GpuSpec<number>;
  l2Cache?: GpuSpec<number>;

  // Theoretical Performance
  pixelFillRate?: GpuSpec<number>;
  textureFillRate?: GpuSpec<number>;
  fp32Performance?: GpuSpec<number>;
  fp64Performance?: GpuSpec<number>;

  // API Support
  directxVersion?: GpuSpec<number | string>;
  openClVersion?: GpuSpec<number | string>;
  openGlVersion?: GpuSpec<number | string>;
  shaderModelVersion?: GpuSpec<number | string>;

  [key: string]: number | GpuSpec;
}

export type GpuSpecKey = keyof GpuSpecs;

export interface GpuSpecMeta {
  specKey?: GpuSpecKey;
  source?: string;
  currency?: string;
  displayUnit?: GpuSpecUnit;
}

export interface GpuSpec<T = unknown> {
  value?: T;
  meta?: GpuSpecMeta;
}

export enum BandwidthUnit {
  Kbps = 'Kb/s',
  Mbps = 'Mb/s',
  Gbps = 'Gb/s',
}

export enum BitUnit {
  bit = 'bit',
}

export enum ClockSpeedUnit {
  KHz = 'KHz',
  MHz = 'MHz',
  GHz = 'GHz',
}

export enum FlopsUnit {
  GFLOPS = 'GFLOPS',
  TFLOPS = 'TFLOPS',
}

export enum LengthUnit {
  um = 'μm',
  nm = 'nm',
  mm = 'mm',
}

export enum MemoryUnit {
  KB = 'KB',
  MB = 'MB',
  GB = 'GB',
}

export enum NumericUnit {
  million = 'million',
}

export enum PixelFillRateUnit {
  GPixelps = 'GPixel/s',
}

export enum StorageUnit {
  KB = 'KB',
  MB = 'MB',
  GB = 'GB',
  TB = 'TB',
}

export enum TextureFillRateUnit {
  GTexelps = 'GTexel/s',
}

export enum WattageUnit {
  W = 'W',
}

export enum WeightUnit {
  kg = 'kg',
}

export type GpuSpecUnit =
  | BandwidthUnit
  | BitUnit
  | ClockSpeedUnit
  | FlopsUnit
  | LengthUnit
  | MemoryUnit
  | NumericUnit
  | PixelFillRateUnit
  | StorageUnit
  | TextureFillRateUnit
  | WattageUnit
  | WeightUnit;

export const gpuSpecValidator = Joi.object({
  value: Joi.any().allow(null),
  meta: Joi.any().allow(null),
}).options({ abortEarly: false });

export const gpuSpecsValidator = Joi.object({
  // General
  company: gpuSpecValidator.allow(null),
  marketSegment: gpuSpecValidator.allow(null),
  launchPrice: gpuSpecValidator.allow(null),
  releaseDate: gpuSpecValidator.allow(null),

  // Processor
  gpuCodename: gpuSpecValidator.allow(null),
  architecture: gpuSpecValidator.allow(null),
  processSize: gpuSpecValidator.allow(null),
  transistors: gpuSpecValidator.allow(null),

  // Memory
  memorySize: gpuSpecValidator.allow(null),
  memoryType: gpuSpecValidator.allow(null),
  memoryClock: gpuSpecValidator.allow(null),
  memoryInterface: gpuSpecValidator.allow(null),
  memoryBandwidth: gpuSpecValidator.allow(null),

  // Board Design
  slotWidth: gpuSpecValidator.allow(null),
  length: gpuSpecValidator.allow(null),
  width: gpuSpecValidator.allow(null),
  height: gpuSpecValidator.allow(null),
  weight: gpuSpecValidator.allow(null),
  thermalDesignPower: gpuSpecValidator.allow(null),
  suggestedPsu: gpuSpecValidator.allow(null),
  busInterface: gpuSpecValidator.allow(null),
  powerConnectors: gpuSpecValidator.allow(null),
  outputs: gpuSpecValidator.allow(null),

  // Cores & Clock Speeds
  shaderUnitsCudaCores: gpuSpecValidator.allow(null),
  textureMappingUnits: gpuSpecValidator.allow(null),
  renderOutputUnits: gpuSpecValidator.allow(null),
  tensorCores: gpuSpecValidator.allow(null),
  rayTracingCores: gpuSpecValidator.allow(null),
  coreClockSpeedBase: gpuSpecValidator.allow(null),
  coreClockSpeedBoost: gpuSpecValidator.allow(null),
  l1Cache: gpuSpecValidator.allow(null),
  l2Cache: gpuSpecValidator.allow(null),

  // Theoretical Performance
  pixelFillRate: gpuSpecValidator.allow(null),
  textureFillRate: gpuSpecValidator.allow(null),
  fp32Performance: gpuSpecValidator.allow(null),
  fp64Performance: gpuSpecValidator.allow(null),

  // API Support
  directxVersion: gpuSpecValidator.allow(null),
  openClVersion: gpuSpecValidator.allow(null),
  openGlVersion: gpuSpecValidator.allow(null),
  shaderModelVersion: gpuSpecValidator.allow(null),
}).options({ abortEarly: false });
