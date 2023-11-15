import { ApiClient } from '../shared/ApiClient';

export interface AutomationMetadata {
  updateSitemapsDate?: number;
  updateCpuSourcesDate?: number;
  updateGpuChipsetSourcesDate?: number;
  updateProductCalculationsDate?: number;
}

export interface AutomationContext {
  api: ApiClient;
  requestChunkDelay: number;
  concurrency: boolean;

  metadata?: AutomationMetadata;
}
