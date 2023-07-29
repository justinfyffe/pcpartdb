import {
  EnqueueAutomationRequest,
  joinUrlParts,
  ListAutomationQueueRequest,
  ListAutomationQueueResponse,
} from '@pcpartdb/shared';
import { ApiClient, apiClient } from '../../shared/api';

const PATH = 'automation';

export class AutomationService {
  constructor(private api: ApiClient) {}

  async listPending(request: ListAutomationQueueRequest) {
    return await this.api.get<ListAutomationQueueResponse>(
      joinUrlParts(PATH, 'queue/pending'),
      {
        params: {
          req: JSON.stringify(request),
        },
      },
    );
  }

  async enqueue(request: EnqueueAutomationRequest) {
    await this.api.post(joinUrlParts(PATH, 'queue'), request);
  }

  async deleteItem(id: number) {
    await this.api.delete(joinUrlParts(PATH, `queue/${id}`));
  }
}

export const automationService = new AutomationService(apiClient);
