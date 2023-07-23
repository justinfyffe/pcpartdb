import { EnqueueAutomationRequest, joinUrlParts } from '@pcpartdb/shared';
import { ApiClient, apiClient } from '../../shared/api';

const PATH = 'automation';

export class AutomationService {
  constructor(private api: ApiClient) {}

  async enqueue(request: EnqueueAutomationRequest) {
    await this.api.post(joinUrlParts(PATH, 'queue'), request);
  }
}

export const automationService = new AutomationService(apiClient);
