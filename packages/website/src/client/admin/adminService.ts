import {
  joinUrlParts,
  ListDataUpdatesRequest,
  ListDataUpdatesResponse,
} from '@pcpartdb/shared';
import { ApiClient, apiClient } from '../shared/api';

const DATA_UPDATES_PATH = 'data-updates';

export class AdminService {
  constructor(private api: ApiClient) {}

  async getUpdates(request: ListDataUpdatesRequest) {
    return await this.api.get<ListDataUpdatesResponse>(DATA_UPDATES_PATH, {
      params: { q: JSON.stringify(request) },
    });
  }

  async approvePendingUpdate(id: number) {
    const path = joinUrlParts(DATA_UPDATES_PATH, String(id), 'approve');
    return await this.api.put(path, {});
  }

  async rejectPendingUpdate(id: number) {
    const path = joinUrlParts(DATA_UPDATES_PATH, String(id), 'reject');
    return await this.api.put(path, {});
  }
}

export const adminService = new AdminService(apiClient);
