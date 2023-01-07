import { Benchmarks, BenchmarksRequest } from '../benchmark';
import { PartImages, PartImagesRequest } from '../part-image';
import { PartMetas, PartMetasRequest } from '../part-meta';
import { Specs, SpecsRequest } from '../spec';

export enum PartType {
  CPU = 'CPU',
  GPU = 'GPU',
}

export interface Part {
  id?: number;
  slug: string;

  type: PartType;
  name: string;

  specs?: Specs;
  metas?: PartMetas;
  benchmarks?: Benchmarks;
  images?: PartImages;
}

export interface PartRequest {
  slug: string;

  type: PartType;
  name: string;

  specs: SpecsRequest;
  metas: PartMetasRequest;
  benchmarks: BenchmarksRequest;
  images: PartImagesRequest;
}

export type PartComparison = [Part, Part];

export interface FindPartRequest {
  id?: number;
  slug?: string;

  includeRanks?: boolean;
  includeImages?: boolean;
}

export interface FindComparisonRequest {
  slug?: string;

  includeRanks?: boolean;
  includeImages?: boolean;
}

export interface RelatedParts {
  gpus?: Part[];
  comparisons?: PartComparison[];
}

export interface RelatedPartsRequest {
  type: PartType;
  seed?: Part | PartComparison;
  prioritize?: PartSort;
  limit?: number;
}

export enum PartSort {
  Id = 'id',
  Name = 'name',
  PerformanceRating = 'performance-rating',
  ValueRating = 'value-rating',
  ReleaseDate = 'release-date',
}

export enum PartOrder {
  Asc = 'asc',
  Desc = 'desc',
}

export interface PartsFilter {
  company?: string[];
  architecture?: string[];
  year?: number[];

  performanceRated?: boolean;
  valueRated?: boolean;
}

export interface PartsOrderBy {
  sort: PartSort;
  order?: PartOrder;
}

export interface PartsQuery {
  filter?: PartsFilter;
  orderBy?: PartsOrderBy;
}

export interface ListPartsRequest {
  type: PartType;
  query?: PartsQuery;
}

export interface ImportPartRequest {
  url?: string;
}

export interface ImportPartResults {
  name?: string;
  specs?: Specs;
  metas?: PartMetas;
  benchmarks?: Benchmarks;
}

export interface ExportPartRequest {
  id: number;
}

export interface ExportPartResult {
  file: string;
  recommendedFileName: string;
}
