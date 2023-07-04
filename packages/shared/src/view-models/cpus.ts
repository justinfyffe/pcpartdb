import {
  Cpu,
  CpuComparison,
  ListCpusResponse,
  RelatedCpuComparisons,
  RelatedCpus,
} from '../product';

export interface AdminEditCpuViewModel {
  cpu: Cpu;
}

export interface CompareCpusContentData {
  relativePerformanceCpus: Cpu[];
  relativeValueCpus: Cpu[];
}

export interface CompareCpusViewModel {
  comparison: CpuComparison;
  contentData: CompareCpusContentData;
  relatedCpus: RelatedCpus;
  relatedComparisons: RelatedCpuComparisons;
}

export interface ListCpusViewModel extends ListCpusResponse {}

export interface ViewCpuContentData {
  totalPerformanceCpus: number;
  totalPerformanceSegmentYearCpus: number;

  relativePerformanceCpus?: Cpu[];
  relativeValueCpus?: Cpu[];

  bestPerformanceCpu?: Cpu;
  bestValueCpu?: Cpu;
}

export interface ViewCpuViewModel {
  cpu: Cpu;

  contentData: ViewCpuContentData;
  relatedCpus: RelatedCpus;
  relatedComparisons: RelatedCpuComparisons;
}
