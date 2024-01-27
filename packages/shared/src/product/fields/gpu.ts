import {
  MarketSegment,
  ProductField,
  ProductFieldMeta,
  ProductionStatus,
} from './common';

// Types

export type GpuFieldKey = keyof GpuFields;

export interface GpuFieldMeta extends ProductFieldMeta {
  fieldKey?: GpuFieldKey;
}

export interface GpuField<T = unknown> extends ProductField<T> {
  meta?: GpuFieldMeta;
}

export interface GpuFieldsMeta {}

export interface GpuFields {
  id?: number;
  productId?: number;

  // General Info
  architecture?: GpuField<string>;
  busInterface?: GpuField<string>;
  codename?: GpuField<string>;
  computeUnits?: GpuField<number>; // aka Stream Multiprocessor (SM),
  cudaVersion?: GpuField<string>;
  density?: GpuField<number>;
  dieSize?: GpuField<number>;
  directxVersion?: GpuField<string>;
  foundry?: GpuField<string>;
  fp16?: GpuField<number>;
  fp32?: GpuField<number>;
  fp64?: GpuField<number>;
  generation?: GpuField<string>;
  gpuCoreBaseClock?: GpuField<number>;
  gpuCoreBoostClock?: GpuField<number>;
  gpuCores?: GpuField<number>; // aka CUDA Cores, Stream Processors
  height?: GpuField<number>;
  l1Cache?: GpuField<number>;
  l2Cache?: GpuField<number>;
  length?: GpuField<number>;
  marketSegment?: GpuField<MarketSegment>;
  memoryBandwidth?: GpuField<number>;
  memoryClock?: GpuField<number>;
  memoryClockEffective?: GpuField<number>;
  memoryInterface?: GpuField<number>;
  memorySize?: GpuField<number>;
  memoryType?: GpuField<string>;
  msrp?: GpuField<number>;
  openClVersion?: GpuField<string>;
  openGlVersion?: GpuField<string>;
  outputs?: GpuField<string>;
  partNumber?: GpuField<string>;
  pixelRate?: GpuField<number>;
  pixelShaders?: GpuField<number>;
  powerConnectors?: GpuField<string>;
  predecessorGeneration?: GpuField<string>;
  processSize?: GpuField<number>;
  productionStatus?: GpuField<ProductionStatus>;
  releaseDate?: GpuField<string>;
  rops?: GpuField<number>; // aka Render Output Units
  rtCores?: GpuField<number>; // aka Ray Tracing Cores
  shaderClock?: GpuField<number>;
  shaderModelVersion?: GpuField<string>;
  slotWidth?: GpuField<number>;
  successorGeneration?: GpuField<string>;
  suggestedPsu?: GpuField<number>;
  tdp?: GpuField<number>; // aka Thermal Design Power
  tensorCores?: GpuField<number>;
  textureRate?: GpuField<number>;
  tmus?: GpuField<number>; // aka Texture Mapping Units
  transistors?: GpuField<number>;
  vertexRate?: GpuField<number>;
  vertexShaders?: GpuField<number>;
  vulkanVersion?: GpuField<string>;
  weight?: GpuField<number>;
  width?: GpuField<number>;

  metadata?: GpuFieldsMeta;
}

// Consts

export const GPU_FIELD_LABELS: Record<string, string> = {
  name: 'Name',

  // General
  partNumber: 'Part Number',
  marketSegment: 'Market Segment',
  msrp: 'Launch Price (MSRP)',
  releaseDate: 'Release Date',
  productionStatus: 'Production Status',

  // Processor
  codename: 'Codename',
  architecture: 'Architecture',
  processSize: 'Process Size',
  transistors: 'Transistors',

  // Memory
  memorySize: 'Memory Size',
  memoryType: 'Memory Type',
  memoryClock: 'Memory Clock',
  memoryInterface: 'Memory Interface',
  memoryBandwidth: 'Memory Bandwidth',

  // Board Design
  slotWidth: 'Slots',
  length: 'Length',
  width: 'Width',
  height: 'Height',
  weight: 'Weight',
  tdp: 'Thermal Design Power (TDP)',

  suggestedPsu: 'Suggested PSU',
  busInterface: 'Bus Interface',
  powerConnectors: 'Power Connectors',
  outputs: 'Outputs',

  // Cores & Clock Speeds
  gpuCores: 'GPU Cores',
  computeUnits: 'Compute Units',
  tmus: 'Texture Mapping Units (TMUs)',
  rops: 'Render Output Units (ROPs)',
  tensorCores: 'Tensor Cores',
  rtCores: 'Ray Tracing Cores',
  gpuCoreBaseClock: 'Clock Speed (Base)',
  gpuCoreBoostClock: 'Clock Speed (Boost)',
  l1Cache: 'L1 Cache',
  l2Cache: 'L2 Cache',

  // Theoretical Performance
  pixelRate: 'Pixel Fill Rate',
  textureRate: 'Texture Fill Rate',
  fp32: 'FP32 Performance',
  fp64: 'FP64 Performance',

  // API Support
  directxVersion: 'DirectX',
  openClVersion: 'OpenCL',
  openGlVersion: 'OpenGL',
  shaderModelVersion: 'Shader Model',
};
