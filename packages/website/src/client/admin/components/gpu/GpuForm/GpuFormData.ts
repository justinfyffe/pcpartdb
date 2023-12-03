import {
  GpuField,
  MarketSegment,
  ProductBenchmark,
  ProductImage,
  ProductionStatus,
  ProductSource,
} from '@pcpartdb/shared';

export interface GpuFormData {
  // GPU Parent / Chipset ID
  parentId?: number;

  name: string;
  slug: string;

  company?: string;
  otherNames?: string[];
  searchText?: string;
  affiliateUrl?: string;
  summary?: string;

  // General
  partNumber?: GpuField<string>;
  marketSegment?: GpuField<MarketSegment>;
  msrp?: GpuField<number>;
  releaseDate?: GpuField<string>;
  productionStatus?: GpuField<ProductionStatus>;

  // Processor
  codename?: GpuField<string>;
  architecture?: GpuField<string>;
  processSize?: GpuField<number>;
  transistors?: GpuField<number>;

  // Board Compatibility & Dimensions
  slotWidth?: GpuField<number>;
  length?: GpuField<number>;
  width?: GpuField<number>;
  height?: GpuField<number>;
  weight?: GpuField<number>;
  busInterface?: GpuField<string>;
  tdp?: GpuField<number>;
  suggestedPsu?: GpuField<number>;
  powerConnectors?: GpuField<string>;
  outputs?: GpuField<string>;

  // Cores & Clock Speeds
  gpuCores?: GpuField<number>;
  computeUnits?: GpuField<number>;
  tmus?: GpuField<number>;
  rops?: GpuField<number>;
  tensorCores?: GpuField<number>;
  rtCores?: GpuField<number>;
  gpuCoreBaseClock?: GpuField<number>;
  gpuCoreBoostClock?: GpuField<number>;
  l1Cache?: GpuField<number>;
  l2Cache?: GpuField<number>;

  // Theoretical Performance
  pixelRate?: GpuField<number>;
  textureRate?: GpuField<number>;
  fp32?: GpuField<number>;
  fp64?: GpuField<number>;

  // Memory
  memorySize?: GpuField<number>;
  memoryType?: GpuField<string>;
  memoryClock?: GpuField<number>;
  memoryInterface?: GpuField<number>;
  memoryBandwidth?: GpuField<number>;

  // API Support
  directxVersion?: GpuField<string>;
  openClVersion?: GpuField<string>;
  openGlVersion?: GpuField<string>;
  shaderModelVersion?: GpuField<string>;

  // Benchmarks
  benchmarks?: ProductBenchmark[];

  // Sources
  sources?: ProductSource[];

  // Images
  images?: ProductImage[];
}
