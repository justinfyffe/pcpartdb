import { AutomationSource } from '../../automation';
import { ListQuery } from '../../common';
import {
  MarketSegment,
  Product,
  ProductField,
  ProductFieldMeta,
  ProductionStatus,
  ProductType,
} from '..';

export enum ListGpusPresetSlug {
  BestPerformance = 'best-performance',
  BestPerformanceAmd = 'best-performance-amd',
  BestPerformanceNvidia = 'best-performance-nvidia',
  BestValue = 'best-value',
  BestValueAmd = 'best-value-amd',
  BestValueNvidia = 'best-value-nvidia',
  Newest = 'newest',
  Oldest = 'oldest',
}

export enum GpuProductType {
  Chipset = 'CHIPSET',
  RetailModel = 'RETAIL_MODEL',
}

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

  performanceRating?: GpuField<number>;
  performancePerMsrp?: GpuField<number>;

  metadata?: GpuFieldsMeta;
}

export interface GpuProduct extends Product {
  productType: ProductType.Gpu;
  fields?: GpuFields;
  parent?: GpuProduct;
}

export type GpuProductComparison = [GpuProduct, GpuProduct];

export interface ListGpusFilter {
  company?: string[];
  year?: number[];
  segment?: MarketSegment[];

  maxPerformanceScore?: number;
  minPerformanceScore?: number;
  maxValueScore?: number;
  minValueScore?: number;

  performanceRated?: boolean;
  valueRated?: boolean;

  chipsetId?: number;
  isChipset?: boolean;
  isRetailModel?: boolean;

  excludeIds?: number[];
}
export interface ListGpusQuery extends ListQuery<ListGpusFilter> {}

export interface ListGpusAdditionalData {
  retailModelCounts?: Record<number, number>;
}

/**
 * Group of GPU automation sources, usually grouped by source name.
 */
export type GpuAutomationSourceGroup = AutomationSource[];
