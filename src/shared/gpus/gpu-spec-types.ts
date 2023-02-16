import Joi from '@hapi/joi';
import { GpuField, gpuFieldValidator } from './gpu-field-types';

export interface GpuSpecs {
  gpuId?: number;

  // Processor
  codename?: GpuField<string>;
  architecture?: GpuField<string>;
  processSize?: GpuField<number>;
  transistors?: GpuField<number>;

  // Memory
  memorySize?: GpuField<number>;
  memoryType?: GpuField<string>;
  memoryClock?: GpuField<number>;
  memoryInterface?: GpuField<number>;
  memoryBandwidth?: GpuField<number>;

  // Board Design
  slotWidth?: GpuField<number>;
  length?: GpuField<number>;
  width?: GpuField<number>;
  height?: GpuField<number>;
  weight?: GpuField<number>;
  thermalDesignPower?: GpuField<number>;
  suggestedPsu?: GpuField<number>;
  busInterface?: GpuField<string>;
  powerConnectors?: GpuField<string>;
  outputs?: GpuField<string>;

  // Cores & Clock Speeds
  shaderUnitsCudaCores?: GpuField<number>;
  textureMappingUnits?: GpuField<number>;
  renderOutputUnits?: GpuField<number>;
  tensorCores?: GpuField<number>;
  rayTracingCores?: GpuField<number>;
  coreClockSpeedBase?: GpuField<number>;
  coreClockSpeedBoost?: GpuField<number>;
  l1Cache?: GpuField<number>;
  l2Cache?: GpuField<number>;

  // Theoretical Performance
  pixelFillRate?: GpuField<number>;
  textureFillRate?: GpuField<number>;
  fp32Performance?: GpuField<number>;
  fp64Performance?: GpuField<number>;

  // API Support
  directxVersion?: GpuField<string>;
  openClVersion?: GpuField<string>;
  openGlVersion?: GpuField<string>;
  shaderModelVersion?: GpuField<string>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // [key: string]: number | GpuField<any>;
}

export const gpuSpecsValidator = Joi.object({
  // Processor
  codename: gpuFieldValidator.allow(null),
  architecture: gpuFieldValidator.allow(null),
  processSize: gpuFieldValidator.allow(null),
  transistors: gpuFieldValidator.allow(null),

  // Memory
  memorySize: gpuFieldValidator.allow(null),
  memoryType: gpuFieldValidator.allow(null),
  memoryClock: gpuFieldValidator.allow(null),
  memoryInterface: gpuFieldValidator.allow(null),
  memoryBandwidth: gpuFieldValidator.allow(null),

  // Board Design
  slotWidth: gpuFieldValidator.allow(null),
  length: gpuFieldValidator.allow(null),
  width: gpuFieldValidator.allow(null),
  height: gpuFieldValidator.allow(null),
  weight: gpuFieldValidator.allow(null),
  thermalDesignPower: gpuFieldValidator.allow(null),
  suggestedPsu: gpuFieldValidator.allow(null),
  busInterface: gpuFieldValidator.allow(null),
  powerConnectors: gpuFieldValidator.allow(null),
  outputs: gpuFieldValidator.allow(null),

  // Cores & Clock Speeds
  shaderUnitsCudaCores: gpuFieldValidator.allow(null),
  textureMappingUnits: gpuFieldValidator.allow(null),
  renderOutputUnits: gpuFieldValidator.allow(null),
  tensorCores: gpuFieldValidator.allow(null),
  rayTracingCores: gpuFieldValidator.allow(null),
  coreClockSpeedBase: gpuFieldValidator.allow(null),
  coreClockSpeedBoost: gpuFieldValidator.allow(null),
  l1Cache: gpuFieldValidator.allow(null),
  l2Cache: gpuFieldValidator.allow(null),

  // Theoretical Performance
  pixelFillRate: gpuFieldValidator.allow(null),
  textureFillRate: gpuFieldValidator.allow(null),
  fp32Performance: gpuFieldValidator.allow(null),
  fp64Performance: gpuFieldValidator.allow(null),

  // API Support
  directxVersion: gpuFieldValidator.allow(null),
  openClVersion: gpuFieldValidator.allow(null),
  openGlVersion: gpuFieldValidator.allow(null),
  shaderModelVersion: gpuFieldValidator.allow(null),
}).options({ abortEarly: false });
