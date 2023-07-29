import { AutomationAction } from './actions';

export enum AutomationQueueStatus {
  Pending = 'PENDING',
  Processed = 'PROCESSED',
}

/**
 * Automation actions that we want to prioritize in a queue. Some actions may
 * result in additional actions or require approvals
 *
 * Priority queue is ordered by `priority DESC, timestamp ASC`
 */
export interface AutomationQueueItem<T = unknown> {
  id?: number;

  description?: string;
  status: AutomationQueueStatus;
  action: AutomationAction;

  data?: T;
  metadata?: AutomationQueueItemMeta;

  priority?: number;
  timestamp?: number;

  statusUpdatedAt?: number;
}

export interface AutomationQueueItemMeta {}
