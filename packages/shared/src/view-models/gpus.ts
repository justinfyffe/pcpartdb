import { GpuProduct, GpuProductComparison, ListGpusResponse } from '../product';
import { UserSettings } from '../user';

export interface CompareGpusViewModel {
  comparison: GpuProductComparison;

  relatedGpus: Partial<GpuProduct>[];
  relatedComparisons: GpuProductComparison[];

  relativePerformanceGpus: Partial<GpuProduct>[];
  relativeValueGpus: Partial<GpuProduct>[];

  retailModels1?: Partial<GpuProduct>[];
  retailModels2?: Partial<GpuProduct>[];

  contentData: GpuContentData;
}

export interface ListGpusViewModel extends ListGpusResponse {}

export interface ViewGpuViewModel {
  gpu: GpuProduct;

  relatedGpus: Partial<GpuProduct>[];
  relatedGpuComparisons: GpuProductComparison[];

  relativePerformanceGpus: Partial<GpuProduct>[];
  relativeValueGpus: Partial<GpuProduct>[];

  retailModels?: Partial<GpuProduct>[];

  contentData: GpuContentData;
}

export interface GpuContentData {
  bestPerformanceGpu?: Partial<GpuProduct>;
  bestValueGpu?: Partial<GpuProduct>;
}
