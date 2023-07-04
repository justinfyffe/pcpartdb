import { Operation } from 'fast-json-patch';
import { Cpu, Gpu, ProductDiff } from '../product';
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
  cpuId?: number;
  gpuId?: number;

  description?: string;
  status: DataUpdateStatus;
  updateSource: DataUpdateSource;

  data?: TUpdateData;
  metadata?: DataUpdateMeta;

  decisionMadeAt?: number;

  // Relations
  decisionUser?: User;
  cpu?: Cpu;
  gpu?: Gpu;
}

export interface ProductDataUpdate extends DataUpdate<ProductDiff> {}

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
