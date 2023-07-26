import { ListQuery, ListResponse } from '../common';
import { ProductUpdate } from '../product';
import { AutomationAction } from './actions';
import { AutomationQueueItemMeta } from './queue';

export interface EnqueueAutomationRequest<T = unknown> {
  action: AutomationAction;
  description?: string;

  data?: T;
  metadata?: AutomationQueueItemMeta;

  priority?: number;
}

export interface ListAutomationQueueQuery extends ListQuery<never> {}

export interface ListAutomationQueueRequest {
  query: ListAutomationQueueQuery;
}

export interface ListAutomationQueueResponse
  extends ListResponse<ListAutomationQueueQuery, ProductUpdate> {}
