import { ListQuery, ListResponse } from '../common';
import { ProductSourceGroup, ProductType } from './types';

export interface ListProductSourcesFilter {
  productType?: ProductType;
  includeArchived?: boolean;
}

export interface ListProductSourcesQuery
  extends ListQuery<ListProductSourcesFilter> {}

export interface ListProductSourcesRequest {
  query: ListProductSourcesQuery;
}

export interface ListProductSourceGroupsResponse
  extends ListResponse<ListProductSourcesQuery, ProductSourceGroup> {}
