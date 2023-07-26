import { AutomationAction, AutomationQueueItem } from '@pcpartdb/shared';
import { ApiClient } from '../shared/ApiClient';

export interface AutomationExecution<TPayload = unknown> {
  action: AutomationAction;
  payload?: TPayload;
  queueItem?: AutomationQueueItem;
}

export interface AutomationMetadata {
  updateSitemapsDate?: number;
  updateCpuSourcesDate?: number;
  updateGpuSourcesDate?: number;
}

export interface AutomationContext {
  api: ApiClient;
  metadata?: AutomationMetadata;
}
