import { Image } from '../../image';
import {
  BaseProductSource,
  BaseProductUpdate,
  CpuDataSourceKey,
  ProductDiff,
  ProductField,
  ProductFieldMeta,
  ProductType,
} from '..';

export type CpuFieldKey = keyof CpuFields;

export interface CpuFieldMeta extends ProductFieldMeta {
  fieldKey?: CpuFieldKey;
  source?: CpuDataSourceKey;
}

export interface CpuField<T = unknown> extends ProductField<T> {
  meta?: CpuFieldMeta;
}

export interface CpuRanks {
  performanceRank?: number;
  performanceRankForSegment?: number;

  valueRank?: number;
  valueRankForSegment?: number;
}

export interface CpuRanksFilter {
  segment?: CpuMarketSegmentValue[];
}

export type CpuRank = keyof CpuRanks;

export interface CpuImage {
  cpuId?: number;
  imageId?: number;

  image?: Image;
}

export type CpuImages = CpuImage[];

export enum CpuMarketSegmentValue {
  Desktop = 'DESKTOP',
  Mobile = 'MOBILE',
  Workstation = 'WORKSTATION',
  Server = 'SERVER',
  Embedded = 'EMBEDDED',
}

export enum CpuProductionStatusValue {
  Unreleased = 'UNRELEASED',
  Active = 'ACTIVE',
  EndOfLife = 'END_OF_LIFE',
}

export interface CpuMeta {
  dataSources?: Record<string, CpuDataSource>;
}

export interface CpuDataSource {
  // External URL to extract data from.
  url?: string;
}

export interface CpuFields {
  // General Info
  partNumber?: CpuField<string>;
  company?: CpuField<string>;
  marketSegment?: CpuField<CpuMarketSegmentValue>;
  launchPrice?: CpuField<number>;
  releaseDate?: CpuField<string>;
  productionStatus?: CpuField<CpuProductionStatusValue>;

  // Physical
  socket?: CpuField<string>;
  foundry?: CpuField<string>;
  processSize?: CpuField<number>;
  transistors?: CpuField<number>;
  tCaseMax?: CpuField<number>; // Max case temperature
  tjMax?: CpuField<number>; // Max core temperature

  // Architecture Specs
  architecture?: CpuField<string>;
  codename?: CpuField<string>;
  generation?: CpuField<string>;
  memorySupport?: CpuField<string[]>; // Example: DDR4-3200, DDR5-5600
  memoryChannels?: CpuField<number>;
  hasEccMemory?: CpuField<boolean>;
  pciExpress?: CpuField<string[]>; // Example: PCIe 4.0 x4, PCIe 5.0 x16
  chipsets?: CpuField<string[]>;

  // Cores & Clock Speed Specs
  coresCount?: CpuField<number>;
  threadsCount?: CpuField<number>;
  performanceCoresCount?: CpuField<number>;
  efficientCoresCount?: CpuField<number>;
  clock?: CpuField<number>;
  turboClock?: CpuField<number>;
  performanceCoreClock?: CpuField<number>;
  performanceCoreTurboClock?: CpuField<number>;
  efficientCoreClock?: CpuField<number>;
  efficientCoreTurboClock?: CpuField<number>;
  baseClock?: CpuField<number>;
  multiplier?: CpuField<number>;
  isMultiplierUnlocked?: CpuField<boolean>;

  // Cache Specs
  l1Cache?: CpuField<number>;
  l2Cache?: CpuField<number>;
  l3Cache?: CpuField<number>;
  efficientCoreL1Cache?: CpuField<number>;
  efficientCoreL2Cache?: CpuField<number>;

  // Power Consumption Specs
  tdp?: CpuField<number>;
  pl1?: CpuField<number>; // Power Limit 1
  pl2?: CpuField<number>; // Power Limit 2
  ppt?: CpuField<number>; // Package Power Tracking

  // Graphics & Features
  bundledCooler?: CpuField<string>;
  integratedGraphics?: CpuField<string>;
  extensionsTechnologies?: CpuField<string[]>;

  // Benchmarks
  performanceScore?: CpuField<number>;
  valueScore?: CpuField<number>;
  cpuMarkMultiThread?: CpuField<number>;
  cpuMarkSingleThread?: CpuField<number>;
  geekbenchSingleCore?: CpuField<number>;
  geekbenchMultiCore?: CpuField<number>;
}

export interface Cpu extends CpuFields {
  id?: number;
  slug: string;

  name: string;
  affiliateUrl?: string;

  meta?: CpuMeta;
  automationTimestamp?: number;

  updatedAt?: number;

  // Relations
  images?: CpuImages;

  // Ranks - Non-DB Field
  ranks?: CpuRanks;
}

export type CpuComparison = [Cpu, Cpu];

export enum ListCpusPresetSlug {
  BestPerformance = 'best-performance',
  BestPerformanceAmd = 'best-performance-amd',
  BestPerformanceIntel = 'best-performance-intel',
  BestValue = 'best-value',
  BestValueAmd = 'best-value-amd',
  BestValueIntel = 'best-value-intel',
  Newest = 'newest',
  Oldest = 'oldest',
}

export enum ListCpusSort {
  Id = 'id',
  Name = 'name',
  PerformanceRating = 'performance-rating',
  ValueRating = 'value-rating',
  ReleaseDate = 'release-date',
}

export enum ListCpusOrder {
  Asc = 'asc',
  Desc = 'desc',
}

export interface ListCpusFilter {
  company?: string[];
  year?: number[];
  segment?: CpuMarketSegmentValue[];

  maxPerformanceScore?: number;
  minPerformanceScore?: number;
  maxValueScore?: number;
  minValueScore?: number;

  performanceRated?: boolean;
  valueRated?: boolean;

  excludeIds?: number[];
}

export interface ListCpusOrderBy {
  sort: ListCpusSort;
  order?: ListCpusOrder;
}

export interface ListCpusPagination {
  limit?: number;
  offset?: number;
}

export interface ListCpusQuery {
  filter?: ListCpusFilter;
  orderBy?: ListCpusOrderBy;
  pagination?: ListCpusPagination;
}

export interface CreateCpuRequest extends Omit<Cpu, 'id'> {}

export interface UpdateCpuRequest extends Omit<Cpu, 'id'> {}

export interface RelatedCpus {
  cpus?: Cpu[];
}

export interface RelatedCpuComparisons {
  comparisons?: CpuComparison[];
}

export interface ListCpusContentData {}

export interface ListCpusResponse {
  query: ListCpusQuery;
  cpus: Cpu[];
  totalCpus: number;
  contentData: ListCpusContentData;
}

export type CpuDiff = ProductDiff<Cpu>;

/**
 * Data structure containing information regarding a single source for a
 * CPU. Extends ProductSource as it contains some gpu-specific data.
 */
export interface CpuProductSource extends BaseProductSource {
  productType: ProductType.Cpu;
}

/**
 * Group of CPU product sources, usually grouped by source name.
 */
export type CpuProductSourceGroup = CpuProductSource[];

export interface CpuUpdate extends BaseProductUpdate<CpuDiff> {
  productType: ProductType.Cpu;
  cpuId?: number;
}
