import * as db from '@prisma/client';
import { GpuDataMetaJson } from './GpuDataMetaJson';
import { GpuImageEntity } from './GpuImageEntity';

export type GpuEntity = db.Gpu & {
  chipset?: GpuEntity;
  retailModels?: GpuEntity[];
  images?: GpuImageEntity[];
};

export interface GpuMetaJson extends GpuDataMetaJson {
  dataSources?: Record<string, unknown>;
}
