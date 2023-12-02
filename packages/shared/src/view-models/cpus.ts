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

export interface CompareCpusViewModel {
  comparison: CpuProductComparison;

  relativePerformanceCpus: CpuProduct[];
  relativeValueCpus: CpuProduct[];

  relatedCpus: RelatedProducts;
  relatedCpuComparisons: RelatedProductComparisons;

  contentData: CpuContentData;
}

export interface ListCpusViewModel extends ListCpusResponse {}

export interface ViewCpuViewModel {
  cpu: CpuProduct;

  relativePerformanceCpus: CpuProduct[];
  relativeValueCpus: CpuProduct[];

  relatedCpus: RelatedProducts;
  relatedCpuComparisons: RelatedProductComparisons;

  contentData: CpuContentData;
}

export interface CpuContentData {
  bestPerformanceCpu?: CpuProduct;
}
