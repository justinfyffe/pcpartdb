import { ListQuery, ListRequest, ListResponse } from '../common';
import {
  CpuAutomationSourceGroup,
  GpuAutomationSourceGroup,
  Product,
  ProductSourceKey,
  ProductType,
} from '../product';

/**
 * Data structure containing information regarding a single source for a
 * product.
 */
export interface AutomationSource {
  id?: number;

  groupKey: string;
  productType: ProductType;
  sourceKey: ProductSourceKey;
  externalKey: string;

  sourceName: string;
  sourceUrl: string;

  archived?: boolean;

  relatedProductId?: number;
  relatedProduct?: Product;
}

/**
 * Group of automation sources, usually grouped by source name.
 */
export type AutomationSourceGroup =
  | CpuAutomationSourceGroup
  | GpuAutomationSourceGroup;

export interface UpsertAutomationSourcesRequest {
  sources: AutomationSource[];
  autoArchive?: boolean;
}

export interface AutocompleteAutomationSourcesRequest {
  productType: ProductType;
  source?: ProductSourceKey;
  query?: string;
}

export interface AutocompleteAutomationSourcesResponse {
  sources: AutomationSource[];
}

export interface ListAutomationSourcesFilter {
  productType?: ProductType;
  includeArchived?: boolean;
  search?: string;

  relatedProductId?: number;
  isParent?: boolean;
  isChild?: boolean;
}

export interface ListAutomationSourcesQuery
  extends ListQuery<ListAutomationSourcesFilter> {}

export interface ListAutomationSourcesRequest
  extends ListRequest<ListAutomationSourcesQuery> {}

export interface ListAutomationSourceGroupsResponse
  extends ListResponse<ListAutomationSourcesQuery, AutomationSourceGroup> {}
