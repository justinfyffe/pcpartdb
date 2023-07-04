import * as db from '@prisma/client';
import { CpuDataMetaJson } from './CpuDataMetaJson';
import { CpuImageEntity } from './CpuImageEntity';

export type CpuEntity = db.Cpu & {
  images?: CpuImageEntity[];
};

export interface CpuMetaJson extends CpuDataMetaJson {
  dataSources?: Record<string, unknown>;
}
