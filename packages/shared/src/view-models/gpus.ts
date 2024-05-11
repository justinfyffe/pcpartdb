import {
  GpuProduct,
  GpuProductComparison,
  ListGpusResponse,
  RelativeDataProducts,
} from '../product';

export interface CompareGpusViewModel {
  comparison: GpuProductComparison;

  relatedGpus: Partial<GpuProduct>[];
  relatedGpuComparisons: GpuProductComparison[];

  relativeDataProducts: RelativeDataProducts;
}

export interface ListGpusViewModel extends ListGpusResponse {}

export interface ViewGpuViewModel {
  gpu: GpuProduct;

  relatedGpus: Partial<GpuProduct>[];
  relatedGpuComparisons: GpuProductComparison[];

  relativeDataProducts: RelativeDataProducts;
}
