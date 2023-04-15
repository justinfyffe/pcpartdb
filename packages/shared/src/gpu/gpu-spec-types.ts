import { GpuField } from './gpu-field-types';

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
  computeUnitsSmCount?: GpuField<number>;
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
