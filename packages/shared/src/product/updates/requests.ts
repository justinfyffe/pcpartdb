import { ListQuery, ListRequest, ListResponse } from '../../common';
import { ProductType, SubProductType } from '../common';
import { ProductUpdate, ProductUpdateStatus } from './common';

//
// List Uppdates Request
//

export interface ListProductUpdatesFilter {
  productType: ProductType;
  subProductType?: SubProductType;
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
