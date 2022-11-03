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
