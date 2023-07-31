import { ListQuery, ListResponse } from '../common';
import {
  AutomationAction,
  AutomationActionMeta,
  AutomationActionType,
} from './actions';

export interface CreateAutomationActionRequest<T = unknown> {
  type: AutomationActionType;
  description?: string;

  data?: T;
  metadata?: AutomationActionMeta;

  priority?: number;
}

export interface ListAutomationActionsQuery
  extends Omit<ListQuery<never>, 'filter' | 'orderBy'> {}

export interface ListAutomationActionsRequest {
  query: ListAutomationActionsQuery;
}

export interface ListAutomationActionsResponse
  extends ListResponse<ListAutomationActionsQuery, AutomationAction> {}
