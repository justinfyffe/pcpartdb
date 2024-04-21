import {
  CpuProduct,
  CpuProductComparison,
  ListCpusResponse,
  RelativeDataProducts,
} from '../product';

export interface AdminEditCpuViewModel {
  cpu: CpuProduct;
}

export interface CompareCpusViewModel {
  comparison: CpuProductComparison;

  relatedCpus: Partial<CpuProduct>[];
  relatedCpuComparisons: CpuProductComparison[];

  relativeDataProducts: RelativeDataProducts;
}

export interface ListCpusViewModel extends ListCpusResponse {}

export interface ViewCpuViewModel {
  cpu: CpuProduct;

  relatedCpus: Partial<CpuProduct>[];
  relatedCpuComparisons: CpuProductComparison[];

  relativeDataProducts: RelativeDataProducts;
}
