export interface AutopilotConfig {
  updateSitemapsDate?: number;
  fetchCpuSourcesDate?: number;
  fetchGpuSourcesDate?: number;
}

export interface AutopilotContext {
  config?: AutopilotConfig;
}
