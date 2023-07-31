import { ApiClient } from '../shared/ApiClient';

export interface AutomationMetadata {
  updateSitemapsDate?: number;
  updateCpuSourcesDate?: number;
  updateGpuSourcesDate?: number;
}

export interface AutomationContext {
  api: ApiClient;
  metadata?: AutomationMetadata;
}
