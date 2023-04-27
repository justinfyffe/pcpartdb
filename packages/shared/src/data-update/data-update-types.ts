import { Operation } from 'fast-json-patch';
import { Gpu, GpuDiff } from '../gpu';
import { User } from '../user';

export type Diff = Operation[];

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

export interface DataUpdate<TUpdateData = unknown> {
  id?: number;
  decisionUserId?: number;
  gpuId?: number;

  description?: string;
  status: DataUpdateStatus;
  updateSource: DataUpdateSource;

  data?: TUpdateData;
  metadata?: DataUpdateMeta;

  decisionMadeAt?: number;

  // Relations
  decisionUser?: User;
  gpu?: Gpu;
}

export interface GpuDataUpdate extends DataUpdate<GpuDiff> {}

export interface ListDataUpdatesRequest {
  status?: DataUpdateStatus;
  limit?: number;
  offset?: number;
}

export interface ListDataUpdatesResponse {
  status?: DataUpdateStatus;
  updates: DataUpdate[];
  totalUpdates: number;
}
