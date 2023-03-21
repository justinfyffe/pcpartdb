import Joi from '@hapi/joi';
import { GpuBenchmarks } from './gpu-benchmark-types';
import { GpuField, GpuFieldKey } from './gpu-field-types';
import { GpuImages } from './gpu-image-types';
import { GpuRanks } from './gpu-rank-types';
import { GpuSpecs } from './gpu-spec-types';

export enum MarketSegmentValue {
  Desktop = 'DESKTOP',
  Mobile = 'MOBILE',
  Workstation = 'WORKSTATION',
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
  url?: string;
  downloadDate?: number;
}

export interface Gpu {
  id?: number;
  parentId?: number;
  slug: string;

  name: string;
  affiliateUrl?: string;

  company?: GpuField<string>;
  marketSegment?: GpuField<MarketSegmentValue>;
  launchPrice?: GpuField<number>;
  releaseDate?: GpuField<string>;

  meta?: GpuMeta;

  // Relations
  parent?: Gpu;
  specs?: GpuSpecs;
  benchmarks?: GpuBenchmarks;
  images?: GpuImages;

  // Non-DB Fields
  ranks?: GpuRanks;
}

export type GpuComparison = [Gpu, Gpu];

export enum GpuSort {
  Id = 'id',
  Name = 'name',
  PerformanceRating = 'performance-rating',
  ValueRating = 'value-rating',
  ReleaseDate = 'release-date',
}

export enum GpuOrder {
  Asc = 'asc',
  Desc = 'desc',
}

export interface GpusFilter {
  company?: string[];

  maxPerformanceScore?: number;
  minPerformanceScore?: number;
  maxValueScore?: number;
  minValueScore?: number;

  performanceRated?: boolean;
  valueRated?: boolean;

  excludeIds?: number[];
}

export interface GpusOrderBy {
  sort: GpuSort;
  order?: GpuOrder;
}

export interface GpusQuery {
  filter?: GpusFilter;
  orderBy?: GpusOrderBy;

  limit?: number;
  offset?: number;
}

export interface CreateGpuRequest extends Omit<Gpu, 'id'> {}

export interface UpdateGpuRequest extends Omit<Gpu, 'id'> {}

export interface RelatedGpus {
  gpus?: Gpu[];
}

export interface RelatedComparisons {
  comparisons?: GpuComparison[];
}

export interface ListGpusRequest {
  query: GpusQuery;
  fields?: GpuFieldKey[];
}

export interface ListGpusResponse {
  gpus: Gpu[];
  totalGpus: number;
}

export interface ScrapeGpuDetailsRequest {
  sources: GpuDataSource[];
}

export interface ScrapeGpuDetailsResponse {
  gpu: Partial<Gpu>;
}

export interface PreviewImportGpusResponse {
  newGpus: Gpu[];
  existingGpus: Gpu[];
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
