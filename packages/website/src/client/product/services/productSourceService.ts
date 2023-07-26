import {
  ApplyProductSourcesToProductRequest,
  AutocompleteProductSourcesRequest,
  AutocompleteProductSourcesResponse,
  joinUrlParts,
  ListProductSourceGroupsResponse,
  ListProductSourcesQuery,
  UpsertProductSourcesRequest,
} from '@pcpartdb/shared';
import { ApiClient, apiClient } from '../../shared/api';

const PATH = 'products/sources';

export class ProductSourceService {
  constructor(private api: ApiClient) {}

  async listGroups(query: ListProductSourcesQuery) {
    const response = await this.api.get<ListProductSourceGroupsResponse>(
      joinUrlParts(PATH, 'groups'),
      {
        params: { q: JSON.stringify(query) },
      },
    );
    return response;
  }

  async autocomplete(request: AutocompleteProductSourcesRequest) {
    const response = await this.api.get<AutocompleteProductSourcesResponse>(
      joinUrlParts(PATH, 'autocomplete'),
      {
        params: { req: JSON.stringify(request) },
      },
    );
    return response;
  }

  async applyToProduct(request: ApplyProductSourcesToProductRequest) {
    await this.api.put(joinUrlParts(PATH, 'apply'), request);
  }

  async upsert(request: UpsertProductSourcesRequest) {
    await this.api.post(joinUrlParts(PATH), request);
  }
}

export const productSourceService = new ProductSourceService(apiClient);
