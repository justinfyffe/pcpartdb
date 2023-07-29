import { ListQuery, ListResponse } from '../common';
import { AutomationAction } from './actions';
import { AutomationQueueItem, AutomationQueueItemMeta } from './queue';

export interface EnqueueAutomationRequest<T = unknown> {
  action: AutomationAction;
  description?: string;

  data?: T;
  metadata?: AutomationQueueItemMeta;

  priority?: number;
}

export interface ListAutomationQueueQuery
  extends Omit<ListQuery<never>, 'filter' | 'orderBy'> {}

export interface ListAutomationQueueRequest {
  query: ListAutomationQueueQuery;
}

export interface ListAutomationQueueResponse
  extends ListResponse<ListAutomationQueueQuery, AutomationQueueItem> {}
