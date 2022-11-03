import Joi from '@hapi/joi';

export enum MarketSegmentValue {
  Desktop = 'DESKTOP',
  Laptop = 'LAPTOP',
  Server = 'SERVER',
}

export interface Specs {
  // General
  company?: Spec<string>;
  marketSegment?: Spec<MarketSegmentValue>;
  launchPrice?: Spec<number>;
  releaseDate?: Spec<string>;

  // Processor
  gpuName?: Spec<string>;
  architecture?: Spec<string>;
  processSize?: Spec<number>;
  transistors?: Spec<number>;

  // Memory
  memorySize?: Spec<number>;
  memoryType?: Spec<string>;
  memoryClock?: Spec<number>;
  memoryInterface?: Spec<number>;
  memoryBandwidth?: Spec<number>;

  // Board Design
  slotWidth?: Spec<number | string>;
  length?: Spec<number>;
  width?: Spec<number>;
  height?: Spec<number>;
  weight?: Spec<number>;
  thermalDesignPower?: Spec<number>;
  suggestedPsu?: Spec<number>;
  busInterface?: Spec<string>;
  powerConnectors?: Spec<string>;
  outputs?: Spec<string>;

  // Cores & Clock Speeds
  shaderUnitsCudaCores?: Spec<number>;
  textureMappingUnits?: Spec<number>;
  renderOutputUnits?: Spec<number>;
  tensorCores?: Spec<number>;
  rayTracingCores?: Spec<number>;
  coreClockSpeedBase?: Spec<number>;
  coreClockSpeedBoost?: Spec<number>;
  l1Cache?: Spec<number>;
  l2Cache?: Spec<number>;

  // Theoretical Performance
  pixelFillRate?: Spec<number>;
  textureFillRate?: Spec<number>;
  fp32Performance?: Spec<number>;
  fp64Performance?: Spec<number>;

  // API Support
  directXVersion?: Spec<number>;
  openClVersion?: Spec<number>;
  openGlVersion?: Spec<number>;
  shaderModelVersion?: Spec<number>;
  gSyncFreeSyncSupport?: Spec<boolean>;
  sliCrossfireSupport?: Spec<boolean>;
}

export type SpecsRequest = Specs;
export type SpecKey = keyof Specs;

export enum SpecFormat {
  MarketSegment = 'MARKET_SEGMENT',
  Date = 'Date',
}

export interface SpecMetadata {
  specKey?: SpecKey;
  format?: SpecFormat;
  prefix?: string;
  suffix?: string;
}

export interface Spec<T = unknown> {
  value?: T;
  source?: string;
  metadata?: SpecMetadata;
}

export const specValidator = Joi.object({
  value: Joi.any().allow(null),
  source: Joi.string().allow(null),
  metadata: Joi.any().allow(null),
}).options({ abortEarly: false });

export const specsValidator = Joi.object({
  // General
  company: specValidator.allow(null),
  marketSegment: specValidator.allow(null),
  launchPrice: specValidator.allow(null),
  releaseDate: specValidator.allow(null),

  // Processor
  gpuName: specValidator.allow(null),
  architecture: specValidator.allow(null),
  processSize: specValidator.allow(null),
  transistors: specValidator.allow(null),

  // Memory
  memorySize: specValidator.allow(null),
  memoryType: specValidator.allow(null),
  memoryClock: specValidator.allow(null),
  memoryInterface: specValidator.allow(null),
  memoryBandwidth: specValidator.allow(null),

  // Board Design
  slotWidth: specValidator.allow(null),
  length: specValidator.allow(null),
  width: specValidator.allow(null),
  height: specValidator.allow(null),
  weight: specValidator.allow(null),
  thermalDesignPower: specValidator.allow(null),
  suggestedPsu: specValidator.allow(null),
  busInterface: specValidator.allow(null),
  powerConnectors: specValidator.allow(null),
  outputs: specValidator.allow(null),

  // Cores & Clock Speeds
  shaderUnitsCudaCores: specValidator.allow(null),
  textureMappingUnits: specValidator.allow(null),
  renderOutputUnits: specValidator.allow(null),
  tensorCores: specValidator.allow(null),
  rayTracingCores: specValidator.allow(null),
  coreClockSpeedBase: specValidator.allow(null),
  coreClockSpeedBoost: specValidator.allow(null),
  l1Cache: specValidator.allow(null),
  l2Cache: specValidator.allow(null),

  // Theoretical Performance
  pixelFillRate: specValidator.allow(null),
  textureFillRate: specValidator.allow(null),
  fp32Performance: specValidator.allow(null),
  fp64Performance: specValidator.allow(null),

  // API Support
  directXVersion: specValidator.allow(null),
  openClVersion: specValidator.allow(null),
  openGlVersion: specValidator.allow(null),
  shaderModelVersion: specValidator.allow(null),
  gSyncFreeSyncSupport: specValidator.allow(null),
  sliCrossfireSupport: specValidator.allow(null),
}).options({ abortEarly: false });
