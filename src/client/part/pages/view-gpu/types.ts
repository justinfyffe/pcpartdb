import { Part } from '@shared/part';

export interface ViewPageContentData {
  totalPerformanceRatedGpus: number;

  relativePerformanceGpus?: Part[];
  relativeValueGpus?: Part[];
}
