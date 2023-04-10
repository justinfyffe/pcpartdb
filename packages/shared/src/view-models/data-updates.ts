import { DataUpdate } from '../data-update';

export interface AdminPendingUpdatesViewModel {
  pendingUpdates: DataUpdate[];
  totalResults: number;
}
