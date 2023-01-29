import { Image } from '@shared/image';
import { GpuBenchmarks } from './gpu-benchmark-types';
import { GpuImages } from './gpu-image-types';
import { GpuRanks } from './gpu-rank-types';
import { GpuSpecs } from './gpu-spec-types';

export interface Gpu {
  id: number;
  parentId?: number;
  slug: string;

  name: string;
  affiliateUrl?: string;

  parent?: Gpu;
  specs?: GpuSpecs;
  benchmarks?: GpuBenchmarks;
  images?: Image[];

  ranks?: GpuRanks;
}

export type GpuComparison = [Gpu, Gpu];

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

export interface CreateGpuRequest extends Omit<Gpu, 'id' | 'images'> {
  specs: GpuSpecs;
  benchmarks: GpuBenchmarks;
  images: GpuImages;
}

export interface UpdateGpuRequest extends Omit<Gpu, 'id' | 'images'> {
  specs: GpuSpecs;
  benchmarks: GpuBenchmarks;
  images: GpuImages;
}

export interface RelatedGpus {
  gpus?: Gpu[];
  comparisons?: GpuComparison[];
}

export interface RelatedGpusRequest {
  seed?: Gpu | GpuComparison;
  prioritize?: GpuSort;
  limit?: number;
}

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
}

export interface ListGpusRequest {
  query?: GpusQuery;
}

export interface ImportGpuDataRequest {
  url?: string;
}

export interface ImportGpuDataResponse {
  gpu: Partial<Gpu>;
}
