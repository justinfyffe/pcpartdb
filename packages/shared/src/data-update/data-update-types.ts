import { Gpu } from '../gpu';
import { User } from '../user';

export enum DataUpdateStatus {
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  Approved = 'APPROVED',
}

export enum DataUpdateSource {
  AutoUpdater = 'AUTO_UPDATER',
  Manual = 'MANUAL',
}

export interface DataUpdateMeta {}

export interface DataUpdate {
  id?: number;
  decisionUserId?: number;
  gpuId?: number;

  description?: string;
  status: DataUpdateStatus;
  updateSource: DataUpdateSource;

  diff: any;
  metadata: DataUpdateMeta;

  decisionMadeAt?: number;
  createdAt: number;
  updatedAt: number;

  // Relations
  decisionUser?: User;
  gpu?: Gpu;
}
