import { ListProductsRequest, ListProductsResponse } from '../requests';
import { ProductType } from '../types';
import { GpuProduct, ListGpusAdditionalData, ListGpusQuery } from './types';

export interface ListGpusRequest extends ListProductsRequest<ListGpusQuery> {
  productType: ProductType.Gpu;
}

export interface ListGpusResponse
  extends ListProductsResponse<ListGpusQuery, GpuProduct> {
  productType: ProductType.Gpu;
  additionalData: ListGpusAdditionalData;
}
