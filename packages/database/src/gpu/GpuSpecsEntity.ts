import * as db from '@prisma/client';
import { GpuFieldsMetaJson } from './GpuFieldsMetaJson';

export type GpuSpecsEntity = db.GpuSpecs;
export interface GpuSpecsMetaJson extends GpuFieldsMetaJson {}
