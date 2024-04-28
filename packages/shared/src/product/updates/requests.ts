import { ListQuery, ListRequest, ListResponse } from '../../common';
import { ProductType } from '../common';
import { ProductUpdate, ProductUpdateStatus } from './common';

//
// List Uppdates Request
//

export interface ListProductUpdatesFilter {
  productType: ProductType;
  status?: ProductUpdateStatus;
  search?: string;
}

export interface ListProductUpdatesQuery
  extends ListQuery<ListProductUpdatesFilter> {}

export interface ListProductUpdatesRequest
  extends ListRequest<ListProductUpdatesQuery> {}

export interface ListProductUpdatesResponse
  extends ListResponse<ListProductUpdatesQuery, ProductUpdate> {}

//
// Approve Update Request
//

export interface ApproveProductUpdateRequest {
  slug?: string;
}

//
// Reject Update Request
//

export interface RejectProductUpdateRequest {}

//
// Create Update Request
//

export type CreateProductUpdateRequest = ProductUpdate;
