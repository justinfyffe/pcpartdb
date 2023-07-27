import { AutomationAction } from './actions';

export enum AutomationQueueStatus {
  Pending = 'PENDING',
  Processed = 'PROCESSED',
}

/**
 * Automation actions that we want to prioritize in a queue. Some actions may
 * result in additional actions or require approvals Examples:
 * - FETCH_CPU_SOURCES creates a CPU_SOURCE approval entry.
 * - Approving a CPU_SOURCE entry queues a FETCH_CPU_DATA action.
 * - FETCH_CPU_DATA creates a CPU_DATA approval entry.
 *   - Note: UPDATE_CPU does not always create an approval entry, depending on
 *     what data is being updated.
 * -
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
