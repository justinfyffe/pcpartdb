import { ApiClient } from '../shared/ApiClient';

export interface AutopilotConfig {
  updateSitemapsDate?: number;
  fetchCpuSourcesDate?: number;
  fetchGpuSourcesDate?: number;
}

export interface AutopilotContext {
  api: ApiClient;
  config?: AutopilotConfig;
}
