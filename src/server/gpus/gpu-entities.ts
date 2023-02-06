import * as db from '@prisma/client';

export type GpuEntity = db.Gpu & {
  specs?: GpuSpecsEntity;
  benchmarks?: GpuBenchmarksEntity;
  images?: GpuImageEntity[];
};
export type GpuSpecsEntity = db.GpuSpecs;
export type GpuBenchmarksEntity = db.GpuBenchmarks;
export type GpuImageEntity = db.GpuImage & {
  image?: db.Image;
};
