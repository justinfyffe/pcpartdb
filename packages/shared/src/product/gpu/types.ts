import { Image } from '../../image';
import {
  BaseProductSource,
  BaseProductUpdate,
  GpuDataSourceKey,
  ProductDiff,
  ProductField,
  ProductFieldMeta,
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
  source?: GpuDataSourceKey;
}

export interface GpuField<T = unknown> extends ProductField<T> {
  meta?: GpuFieldMeta;
}

export interface GpuRanks {
  performanceRank?: number;
  performanceRankForArchitectureSegment?: number;
  performanceRankForCompanySegment?: number;
  performanceRankForSegment?: number;

  valueRank?: number;
  valueRankForSegment?: number;
}

export interface GpuRanksFilter {
  architecture?: string[];
  company?: string[];
  year?: number[];
  segment?: GpuMarketSegmentValue[];

  isChipset?: boolean;
  isRetailModel?: boolean;
}

export type GpuRank = keyof GpuRanks;

export interface GpuImage {
  gpuId?: number;
  imageId?: number;

  image?: Image;
}

export type GpuImages = GpuImage[];

export enum GpuMarketSegmentValue {
  Desktop = 'DESKTOP',
  Mobile = 'MOBILE',
  Workstation = 'WORKSTATION',
  Integrated = 'INTEGRATED',
}

export enum GpuProductionStatusValue {
  Unreleased = 'UNRELEASED',
  Active = 'ACTIVE',
  EndOfLife = 'END_OF_LIFE',
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

interface GpuFields {
  // General Info
  partNumber?: GpuField<string>;
  company?: GpuField<string>;
  marketSegment?: GpuField<GpuMarketSegmentValue>;
  launchPrice?: GpuField<number>;
  releaseDate?: GpuField<string>;
  productionStatus?: GpuField<GpuProductionStatusValue>;

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

  // Board Design & Compatibility
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
}

export interface Gpu extends GpuFields {
  id?: number;
  chipsetId?: number;
  slug: string;

  name: string;
  affiliateUrl?: string;

  meta?: GpuMeta;
  automationTimestamp?: number;

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
  segment?: GpuMarketSegmentValue[];

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

export interface RelatedGpuComparisons {
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

export type GpuDiff = ProductDiff<Gpu>;

export interface PreviewImportGpusResponse {
  diffs: GpuDiff[];
}

export interface ImportGpusRequest {
  gpus: Gpu[];
}

/**
 * Data structure containing information regarding a single source for a
 * GPU. Extends ProductSource as it contains some gpu-specific data.
 */
export interface GpuProductSource extends BaseProductSource {
  productType: ProductType.Gpu;

  // Retail model sources are only relevant when associated with a chipset
  gpuChipsetId?: number;

  // Relations
  gpuChipset?: Gpu;
}

/**
 * Group of GPU product sources, usually grouped by source name.
 */
export type GpuProductSourceGroup = GpuProductSource[];

export interface GpuUpdate extends BaseProductUpdate<GpuDiff> {
  productType: ProductType.Gpu;
  gpuProductType: GpuProductType;
  gpuId?: number;
}
