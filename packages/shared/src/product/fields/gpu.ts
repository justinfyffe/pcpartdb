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
  computeUnits?: GpuField<number>; // Stream Multiprocessor (SM) for NVIDIA, and Compute Units for AMD, and Execution Units for Intel
  cudaCores?: GpuField<number>; // GPU Cores, CUDA Cores for NVIDIA, Shading Units for Intel, Stream Processors for AMD, Shader Units in general
  cudaVersion?: GpuField<string>;
  density?: GpuField<number>;
  dieSize?: GpuField<number>;
  directxVersion?: GpuField<string>;
  executionUnits?: GpuField<number>; // Stream Multiprocessor (SM) for NVIDIA, and Compute Units for AMD, and Execution Units for Intel
  foundry?: GpuField<string>;
  fp16?: GpuField<number>;
  fp32?: GpuField<number>;
  fp64?: GpuField<number>;
  generation?: GpuField<string>;
  gpuCoreBaseClock?: GpuField<number>;
  gpuCoreBoostClock?: GpuField<number>;
  l1Cache?: GpuField<number>;
  l2Cache?: GpuField<number>;
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
  shadingUnits?: GpuField<number>; // GPU Cores, CUDA Cores for NVIDIA, Shading Units for Intel, Stream Processors for AMD, Shader Units in general
  slotWidth?: GpuField<number>;
  streamProcessors?: GpuField<number>; // GPU Cores, CUDA Cores for NVIDIA, Shading Units for Intel, Stream Processors for AMD, Shader Units in general
  streamMultiprocessors?: GpuField<number>; // Stream Multiprocessor (SM) for NVIDIA, and Compute Units for AMD, and Execution Units for Intel
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
  memoryClockEffective: 'Memory Clock (Effective)',
  memoryInterface: 'Memory Interface',
  memoryBandwidth: 'Memory Bandwidth',

  // Board Design
  slotWidth: 'Slots',
  tdp: 'Thermal Design Power (TDP)',

  suggestedPsu: 'Suggested PSU',
  busInterface: 'Bus Interface',
  powerConnectors: 'Power Connectors',
  outputs: 'Outputs',

  // Cores & Clock Speeds
  streamProcessors: 'Stream Processors (SP)',
  shadingUnits: 'Shading Units',
  cudaCores: 'CUDA Cores',
  //
  computeUnits: 'Compute Units (CU)',
  executionUnits: 'Execution Units (EU)',
  streamMultiprocessors: 'Stream Multiprocessors (SM)',
  //
  tmus: 'Texture Mapping Units (TMU)',
  rops: 'Render Output Units (ROP)',
  tensorCores: 'Tensor Cores',
  rtCores: 'Ray Tracing Cores',
  gpuCoreBaseClock: 'Core Clock Speed',
  gpuCoreBoostClock: 'Core Clock Speed (Boost)',
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
