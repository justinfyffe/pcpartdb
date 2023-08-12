import {
  AutomationStatus,
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
      joinUrlParts(PATH, 'actions/pending'),
      {
        params: {
          req: JSON.stringify(request),
        },
      },
    );
  }

  async createAction<TPayload = unknown>(
    request: CreateAutomationActionRequest<TPayload>,
  ) {
    await this.api.post(joinUrlParts(PATH, 'actions'), request);
  }

  async cancelAction(id: number) {
    await this.api.post(joinUrlParts(PATH, `actions/${id}/cancel`), null);
  }

  async updateStatus(status: AutomationStatus) {
    await this.api.put(joinUrlParts(PATH, 'status'), status);
  }
}

export const automationService = new AutomationService(apiClient);
