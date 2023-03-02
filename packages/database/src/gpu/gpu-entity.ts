import * as db from '@prisma/client';

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
  fields?: Record<string, unknown>;
}

export interface GpuMetaJson extends GpuFieldsMetaJson {
  dataSources?: Record<string, unknown>;
}

export interface GpuSpecsMetaJson extends GpuFieldsMetaJson {}

export interface GpuBenchmarksMetaJson extends GpuFieldsMetaJson {}
