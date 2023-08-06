import { ListQuery, ListRequest, ListResponse } from '../common';
import { GpuProductType } from './gpu';
import {
  ProductSourceGroup,
  ProductType,
  ProductUpdate,
  ProductUpdateStatus,
} from './types';

// Product Sources

export interface ListProductSourcesFilter {
  productType?: ProductType;
  includeArchived?: boolean;
  search?: string;

  // GPU Specific
  gpuProductType?: GpuProductType;
}

export interface ListProductSourcesQuery
  extends ListQuery<ListProductSourcesFilter> {}

export interface ListProductSourcesRequest
  extends ListRequest<ListProductSourcesQuery> {}

export interface ListProductSourceGroupsResponse
  extends ListResponse<ListProductSourcesQuery, ProductSourceGroup> {}

// Product Updates

export interface ListProductUpdatesFilter {
  productType: ProductType;
  status?: ProductUpdateStatus;
  search?: string;

  // GPU Specific
  gpuProductType?: GpuProductType;
}

export interface ListProductUpdatesQuery
  extends ListQuery<ListProductUpdatesFilter> {}

export interface ListProductUpdatesRequest
  extends ListRequest<ListProductUpdatesQuery> {}

export interface ListProductUpdatesResponse
  extends ListResponse<ListProductUpdatesQuery, ProductUpdate> {}

export interface ApproveProductUpdateRequest {
  slug?: string;
}

export interface RejectProductUpdateRequest {}
