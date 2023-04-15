import * as db from '@prisma/client';
import { GpuFieldsMetaJson } from './GpuFieldsMetaJson';
import { GpuImageEntity } from './GpuImageEntity';

export type GpuEntity = db.Gpu & {
  parent?: GpuEntity;
  images?: GpuImageEntity[];
};

export interface GpuMetaJson extends GpuFieldsMetaJson {
  dataSources?: Record<string, unknown>;
}
