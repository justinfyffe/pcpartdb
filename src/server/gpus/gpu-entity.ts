import * as db from '@prisma/client';
import { GpuDataSource, GpuFieldMeta } from '@shared/gpus';

export type GpuEntity = db.Gpu & {
  parent?: GpuEntity;
  specs?: GpuSpecsEntity;
  benchmarks?: GpuBenchmarksEntity;
  images?: GpuImageEntity[];
};
export type GpuSpecsEntity = db.GpuSpecs;
export type GpuBenchmarksEntity = db.GpuBenchmarks;
export type GpuImageEntity = db.GpuImage & {
  image?: db.Image;
};

export interface GpuFieldsMetaJson {
  fields?: Record<string, GpuFieldMeta>;
}

export interface GpuMetaJson extends GpuFieldsMetaJson {
  dataSources?: Record<string, GpuDataSource>;
}

export interface GpuSpecsMetaJson extends GpuFieldsMetaJson {}

export interface GpuBenchmarksMetaJson extends GpuFieldsMetaJson {}
