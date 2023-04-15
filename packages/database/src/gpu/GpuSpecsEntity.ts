import * as db from '@prisma/client';
import { GpuFieldsMetaJson } from './GpuFieldsMetaJson';

// TODO: remove this file

export type GpuSpecsEntity = db.GpuSpecs;
export interface GpuSpecsMetaJson extends GpuFieldsMetaJson {}
