import {
  CreateAutomationActionRequest,
  joinUrlParts,
  ListAutomationActionsRequest,
  ListAutomationActionsResponse,
} from '@pcpartdb/shared';
import { ApiClient, apiClient } from '../../shared/api';

const PATH = 'automation';

export class AutomationService {
  constructor(private api: ApiClient) {}

  async listPending(request: ListAutomationActionsRequest) {
    return await this.api.get<ListAutomationActionsResponse>(
      joinUrlParts(PATH, 'queue/pending'),
      {
        params: {
          req: JSON.stringify(request),
        },
      },
    );
  }

  async enqueue(request: CreateAutomationActionRequest) {
    await this.api.post(joinUrlParts(PATH, 'queue'), request);
  }

  async deleteItem(id: number) {
    await this.api.delete(joinUrlParts(PATH, `queue/${id}`));
  }
}

export const automationService = new AutomationService(apiClient);
