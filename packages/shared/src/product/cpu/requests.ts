import { ListProductsRequest, ListProductsResponse } from '../requests';
import { ProductType } from '../types';
import { CpuProduct, ListCpusAdditionalData, ListCpusQuery } from './types';

export interface ListCpusRequest extends ListProductsRequest<ListCpusQuery> {
  productType: ProductType.Cpu;
}

export interface ListCpusResponse
  extends ListProductsResponse<ListCpusQuery, CpuProduct> {
  productType: ProductType.Cpu;
  additionalData: ListCpusAdditionalData;
}
