import {
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
    return await this.api.put(`${DATA_UPDATES_PATH}/${id}/approve`, {});
  }

  async rejectPendingUpdate(id: number) {
    return await this.api.put(`${DATA_UPDATES_PATH}/${id}/reject`, {});
  }
}

export const adminService = new AdminService(apiClient);
