import * as db from '@prisma/client';
import { GpuFieldsMetaJson } from './GpuFieldsMetaJson';

// TODO: remove this file

export type GpuBenchmarksEntity = db.GpuBenchmarks;
export interface GpuBenchmarksMetaJson extends GpuFieldsMetaJson {}
