import * as db from '@prisma/client';
import { GpuEntity } from '../gpu';
import { UserEntity } from '../user';

export type DataUpdateEntity = db.DataUpdate & {
  decisionUser?: UserEntity;
  gpu?: GpuEntity;
};
