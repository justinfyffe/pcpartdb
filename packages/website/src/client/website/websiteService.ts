import { joinUrlParts } from '@pcpartdb/shared';
import { ApiClient, apiClient } from '../shared/api/apiClient';

const PATH = 'website';

export class WebsiteService {
  constructor(private api: ApiClient) {}

  async clearCache() {
    const path = joinUrlParts(PATH, 'cache');
    return await this.api.delete<{ cacheSize: number; cacheItems: number }>(
      path,
    );
  }
}

export const websiteService = new WebsiteService(apiClient);
