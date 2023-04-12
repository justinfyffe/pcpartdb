import { DataUpdate, DataUpdateStatus } from '../data-update';

export interface AdminDataUpdatesViewModel {
  status?: DataUpdateStatus;
  updates: DataUpdate[];
  totalUpdates: number;
}
