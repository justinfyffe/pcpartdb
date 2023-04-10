import { Operation } from 'fast-json-patch';
import { Gpu } from '../gpu';
import { User } from '../user';

export type DataUpdateOperation = Operation;
export type DataUpdateDiff = DataUpdateOperation[];

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

  diff: DataUpdateDiff;
  metadata: DataUpdateMeta;

  decisionMadeAt?: number;

  // Relations
  decisionUser?: User;
  gpu?: Gpu;
}

export interface ListPendingUpdatesRequest {
  limit?: number;
  offset?: number;
}
