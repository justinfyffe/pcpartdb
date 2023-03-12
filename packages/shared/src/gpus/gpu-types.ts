import Joi from '@hapi/joi';
import { GpuBenchmarks } from './gpu-benchmark-types';
import { GpuField } from './gpu-field-types';
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

  performanceRated?: boolean;
  valueRated?: boolean;
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

export interface FindGpuRequest {
  id?: number;
  slug?: string;

  includeRanks?: boolean;
  includeImages?: boolean;
}

export interface FindGpuComparisonRequest {
  slug?: string;

  includeRanks?: boolean;
  includeImages?: boolean;
}

export interface CreateGpuRequest extends Omit<Gpu, 'id'> {
  specs: GpuSpecs;
  benchmarks: GpuBenchmarks;
  images: GpuImages;
}

export interface UpdateGpuRequest extends Omit<Gpu, 'id'> {
  specs: GpuSpecs;
  benchmarks: GpuBenchmarks;
  images: GpuImages;
}

export interface RelatedGpus {
  gpus?: Gpu[];
}

export interface RelatedComparisons {
  comparisons?: GpuComparison[];
}

export interface ListGpusRequest {
  query?: GpusQuery;
}

export interface ImportGpuDataRequest {
  sources: GpuDataSource[];
}

export interface ImportGpuDataResponse {
  gpu: Partial<Gpu>;
}

export interface PreviewImportGpusResponse {
  newGpus: Gpu[];
  existingGpus: Gpu[];
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
