import { ApiClient } from '../shared/ApiClient';

export interface AutomationConfig {
  updateSitemapsDate?: number;
  fetchCpuSourcesDate?: number;
  fetchGpuSourcesDate?: number;
}

export interface AutomationContext {
  api: ApiClient;
  config?: AutomationConfig;
}
