import { Part } from '@shared/part';

export interface ComparePageContentData {
  totalPerformanceRatedGpus: number;

  relativePerformanceGpus: Part[];
  relativeValueGpus: Part[];
}
