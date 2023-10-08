import {
  CpuProduct,
  CpuProductComparison,
  ListCpusResponse,
  RelatedProductComparisons,
  RelatedProducts,
} from '../product';

export interface AdminEditCpuViewModel {
  cpu: CpuProduct;
}

export interface CompareCpusAdditionalData {
  relativePerformanceCpus: CpuProduct[];
  relativeValueCpus: CpuProduct[];
}

export interface CompareCpusViewModel {
  comparison: CpuProductComparison;

  relatedCpus: RelatedProducts;
  relatedCpuComparisons: RelatedProductComparisons;

  additionalData: CompareCpusAdditionalData;
}

export interface ListCpusViewModel extends ListCpusResponse {}

export interface ViewCpuContentData {
  totalPerformanceCpus: number;

  relativePerformanceCpus?: CpuProduct[];
  relativeValueCpus?: CpuProduct[];

  bestPerformanceCpu?: CpuProduct;
  bestValueCpu?: CpuProduct;
}

export interface ViewCpuViewModel {
  cpu: CpuProduct;

  relatedCpus: RelatedProducts;
  relatedCpuComparisons: RelatedProductComparisons;

  additionalData: ViewCpuContentData;
}
