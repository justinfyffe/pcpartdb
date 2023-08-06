import { ApiClient } from '../shared/ApiClient';

export interface AutomationMetadata {
  updateSitemapsDate?: number;
  updateCpuSourcesDate?: number;
  updateGpuChipsetSourcesDate?: number;
}

export interface AutomationContext {
  api: ApiClient;
  metadata?: AutomationMetadata;
}
