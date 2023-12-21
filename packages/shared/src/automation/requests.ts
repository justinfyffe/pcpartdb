import { ListQuery, ListResponse } from '../common';
import { ProductType } from '../product';
import {
  AutomationAction,
  AutomationActionMeta,
  AutomationActionType,
} from './actions';

export interface CreateAutomationActionRequest<TPayload = unknown> {
  type: AutomationActionType;
  description?: string;

  data?: TPayload;
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

// TODO: delete
export interface UploadPerformanceScoresRequest {
  productType: ProductType;

  // Added by interceptor. Don't populate manually.
  originalFileName?: string;
  tempPath?: string;
}

// TODO: delete
export interface UploadProductCalculationsRequest {
  productType: ProductType;

  // Added by interceptor. Don't populate manually.
  originalFileName?: string;
  tempPath?: string;
}

export interface UploadProductRanksRequest {
  // Added by interceptor. Don't populate manually.
  originalFileName?: string;
  tempPath?: string;
}

export interface UploadRelatedProductsRequest {
  // Added by interceptor. Don't populate manually.
  originalFileName?: string;
  tempPath?: string;
}
