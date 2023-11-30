import {
  CpuProduct,
  CpuProductComparison,
  ListCpusResponse,
  ProductType,
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

export interface CpuAdditionalData {
  productType: ProductType.Cpu;

  countPerformanceRanks?: number;
  countPerformanceRanksForMarketSegment?: number;

  bestPerformanceCpu?: CpuProduct;

  relativePerformanceCpus: CpuProduct[];
  relativeValueCpus: CpuProduct[];
}
