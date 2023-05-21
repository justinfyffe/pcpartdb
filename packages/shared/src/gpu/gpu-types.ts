import Joi from '@hapi/joi';
import { GpuField, gpuFieldValidator } from './gpu-field-types';
import { GpuImages } from './gpu-image-types';
import { GpuRanks } from './gpu-rank-types';

export enum MarketSegmentValue {
  Desktop = 'DESKTOP',
  Mobile = 'MOBILE',
  Workstation = 'WORKSTATION',
  Integrated = 'INTEGRATED',
}

export enum ProductionStatusValue {
  Unreleased = 'UNRELEASED',
  Active = 'ACTIVE',
  EndOfLife = 'END_OF_LIFE',
}

export enum GpuDataSourceKey {
  TechPowerUp = 'TECHPOWERUP',
  UlBenchmarks = 'UL_BENCHMARKS',
  VideocardBenchmarks = 'VIDEOCARD_BENCHMARKS',
}

export interface GpuMeta {
  dataSources?: Record<string, GpuDataSource>;
}

export interface GpuDataSource {
  // Chipset ID to extract some data from like market segment.
  chipsetId?: number;

  // External URL to extract data from.
  url?: string;
}

export interface Gpu {
  id?: number;
  chipsetId?: number;
  slug: string;

  name: string;
  affiliateUrl?: string;

  // General Info
  partNumber?: GpuField<string>;
  company?: GpuField<string>;
  marketSegment?: GpuField<MarketSegmentValue>;
  launchPrice?: GpuField<number>;
  releaseDate?: GpuField<string>;
  productionStatus?: GpuField<ProductionStatusValue>;

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

  // Benchmarks
  performanceScore?: GpuField<number>;
  valueScore?: GpuField<number>;
  g3dMark?: GpuField<number>;
  g2dMark?: GpuField<number>;
  timespyGraphics?: GpuField<number>;

  meta?: GpuMeta;
  updatedAt?: number;

  // Relations
  chipset?: Gpu;
  retailModels?: Gpu[];
  images?: GpuImages;

  // Ranks - Non-DB Field
  ranks?: GpuRanks;
}

export type GpuComparison = [Gpu, Gpu];

export enum ListGpusSort {
  Id = 'id',
  Name = 'name',
  PerformanceRating = 'performance-rating',
  ValueRating = 'value-rating',
  ReleaseDate = 'release-date',
}

export enum ListGpusOrder {
  Asc = 'asc',
  Desc = 'desc',
}

export interface ListGpusFilter {
  architecture?: string[];
  company?: string[];
  year?: number[];
  segment?: MarketSegmentValue[];

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

export interface ListGpusOrderBy {
  sort: ListGpusSort;
  order?: ListGpusOrder;
}

export interface ListGpusPagination {
  limit?: number;
  offset?: number;
}

export interface ListGpusQuery {
  filter?: ListGpusFilter;
  orderBy?: ListGpusOrderBy;
  pagination?: ListGpusPagination;
}

export interface CreateGpuRequest extends Omit<Gpu, 'id'> {}

export interface UpdateGpuRequest extends Omit<Gpu, 'id'> {}

export interface RelatedGpus {
  gpus?: Gpu[];
}

export interface RelatedComparisons {
  comparisons?: GpuComparison[];
}

export interface ListGpusContentData {
  retailModelCounts?: Record<number, number>;
}

export interface ListGpusResponse {
  query: ListGpusQuery;
  gpus: Gpu[];
  totalGpus: number;
  contentData: ListGpusContentData;
}

export interface ListRetailModelsResponse {
  retailModels: Gpu[];
}

export interface ScrapeGpuDetailsRequest {
  sources: GpuDataSource[];
}

export interface ScrapeGpuDetailsResponse {
  gpu: Partial<Gpu>;
}

export interface GpuDiff {
  original?: Gpu;
  updated?: Gpu;
}

export interface PreviewImportGpusResponse {
  diffs: GpuDiff[];
}

export interface ImportGpusRequest {
  gpus: Gpu[];
}

export const gpuDataSourceValidator = Joi.object({
  url: Joi.string().allow(null),
  downloadDate: Joi.number().allow(null),
}).options({ abortEarly: false });

export const gpuMetaValidator = Joi.object({
  dataSources: Joi.object()
    .pattern(/.*/, gpuDataSourceValidator.allow(null))
    .allow(null),
}).options({ abortEarly: false });

export const gpuValidator = Joi.object({
  chipsetId: Joi.number().allow(null),
  slug: Joi.string().required(),
  name: Joi.string().required(),

  partNumber: gpuFieldValidator.allow(null),
  company: gpuFieldValidator.allow(null),
  marketSegment: gpuFieldValidator.allow(null),
  launchPrice: gpuFieldValidator.allow(null),
  releaseDate: gpuFieldValidator.allow(null),
  productionStatus: gpuFieldValidator.allow(null),

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
  computeUnitsSmCount: gpuFieldValidator.allow(null),
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

  performanceScore: gpuFieldValidator.allow(null),
  valueScore: gpuFieldValidator.allow(null),
  g3dMark: gpuFieldValidator.allow(null),
  g2dMark: gpuFieldValidator.allow(null),
  timespyGraphics: gpuFieldValidator.allow(null),

  images: Joi.array().allow(Joi.any()),
  meta: gpuMetaValidator.allow(null),
}).options({ abortEarly: false });
