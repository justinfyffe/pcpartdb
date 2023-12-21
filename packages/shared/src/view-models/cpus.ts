import { CpuProduct, CpuProductComparison, ListCpusResponse } from '../product';

export interface AdminEditCpuViewModel {
  cpu: CpuProduct;
}

export interface CompareCpusViewModel {
  comparison: CpuProductComparison;

  relativePerformanceCpus: CpuProduct[];
  relativeValueCpus: CpuProduct[];

  relatedCpus: Partial<CpuProduct>[];
  relatedCpuComparisons: CpuProductComparison[];

  contentData: CpuContentData;
}

export interface ListCpusViewModel extends ListCpusResponse {}

export interface ViewCpuViewModel {
  cpu: CpuProduct;

  relativePerformanceCpus: Partial<CpuProduct>[];
  relativeValueCpus: Partial<CpuProduct>[];

  relatedCpus: Partial<CpuProduct>[];
  relatedCpuComparisons: CpuProductComparison[];

  contentData: CpuContentData;
}

export interface CpuContentData {
  bestPerformanceCpu?: Partial<CpuProduct>;
  bestValueCpu?: Partial<CpuProduct>;
}
