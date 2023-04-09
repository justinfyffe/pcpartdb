import * as db from '@prisma/client';
import { GpuFieldsMetaJson } from './GpuFieldsMetaJson';

export type GpuBenchmarksEntity = db.GpuBenchmarks;
export interface GpuBenchmarksMetaJson extends GpuFieldsMetaJson {}
