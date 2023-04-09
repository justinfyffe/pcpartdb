import * as db from '@prisma/client';
import { GpuBenchmarksEntity } from './GpuBenchmarksEntity';
import { GpuFieldsMetaJson } from './GpuFieldsMetaJson';
import { GpuImageEntity } from './GpuImageEntity';
import { GpuSpecsEntity } from './GpuSpecsEntity';

export type GpuEntity = db.Gpu & {
  parent?: GpuEntity;
  specs?: GpuSpecsEntity;
  benchmarks?: GpuBenchmarksEntity;
  images?: GpuImageEntity[];
};

export interface GpuMetaJson extends GpuFieldsMetaJson {
  dataSources?: Record<string, unknown>;
}
