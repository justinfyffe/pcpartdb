import * as db from '@prisma/client';
import { GpuEntity } from './GpuEntity';
import { UserEntity } from './UserEntity';

export type DataUpdateEntity = db.DataUpdate & {
  decisionUser?: UserEntity;
  gpu?: GpuEntity;
};
