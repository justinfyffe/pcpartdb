import {
  ApplyAutomationSourcesToProductRequest,
  AutocompleteAutomationSourcesRequest,
  AutocompleteAutomationSourcesResponse,
  joinUrlParts,
  ListAutomationSourceGroupsResponse,
  ListAutomationSourcesRequest,
  UpsertAutomationSourcesRequest,
} from '@pcpartdb/shared';
import { ApiClient, apiClient } from '../../shared/api/apiClient';

const PATH = 'automation/sources';

export class AutomationSourceService {
  constructor(private api: ApiClient) {}

  async listGroups(request: ListAutomationSourcesRequest) {
    const response = await this.api.get<ListAutomationSourceGroupsResponse>(
      joinUrlParts(PATH, 'groups'),
      { params: { req: JSON.stringify(request) } },
    );
    return response;
  }

  async autocomplete(request: AutocompleteAutomationSourcesRequest) {
    const response = await this.api.get<AutocompleteAutomationSourcesResponse>(
      joinUrlParts(PATH, 'autocomplete'),
      { params: { req: JSON.stringify(request) } },
    );
    return response;
  }

  async applyToProduct(request: ApplyAutomationSourcesToProductRequest) {
    await this.api.post(joinUrlParts(PATH, 'apply'), request);
  }

  async upsert(request: UpsertAutomationSourcesRequest) {
    await this.api.post(joinUrlParts(PATH), request);
  }
}

export const automationSourceService = new AutomationSourceService(apiClient);
