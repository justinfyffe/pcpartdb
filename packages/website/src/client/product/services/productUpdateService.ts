import {
  ApproveProductUpdateRequest,
  joinUrlParts,
  ListProductUpdatesRequest,
  ListProductUpdatesResponse,
  RejectProductUpdateRequest,
} from '@pcpartdb/shared';
import { ApiClient, apiClient } from '../../shared/api';

const PATH = 'products/updates';

export class ProductUpdateService {
  constructor(private api: ApiClient) {}

  async listUpdates(request: ListProductUpdatesRequest) {
    const response = await this.api.get<ListProductUpdatesResponse>(
      joinUrlParts(PATH),
      { params: { req: JSON.stringify(request) } },
    );
    return response;
  }

  async approve(id: number, request: ApproveProductUpdateRequest) {
    await this.api.post(joinUrlParts(PATH, String(id), 'approve'), request);
  }

  async reject(id: number, request: RejectProductUpdateRequest) {
    await this.api.post(joinUrlParts(PATH, String(id), 'reject'), request);
  }
}

export const productUpdateService = new ProductUpdateService(apiClient);
