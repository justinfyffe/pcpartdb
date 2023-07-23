import { AutomationAction } from './actions';
import { AutomationQueueItemMeta } from './queue';

export interface EnqueueAutomationRequest<T = unknown> {
  action: AutomationAction;
  description?: string;

  data?: T;
  metadata?: AutomationQueueItemMeta;

  priority?: number;
}
