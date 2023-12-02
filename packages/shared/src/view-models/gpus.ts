import {
  GpuProduct,
  GpuProductComparison,
  ListGpusResponse,
  RelatedProductComparisons,
  RelatedProducts,
} from '../product';

export interface CompareGpusViewModel {
  comparison: GpuProductComparison;

  relatedGpus: RelatedProducts;
  relatedComparisons: RelatedProductComparisons;

  relativePerformanceGpus: GpuProduct[];
  relativeValueGpus: GpuProduct[];

  retailModels1?: GpuProduct[];
  retailModels2?: GpuProduct[];

  contentData: GpuContentData;
}

export interface ListGpusViewModel extends ListGpusResponse {}

export interface ViewGpuViewModel {
  gpu: GpuProduct;

  relatedGpus: RelatedProducts;
  relatedGpuComparisons: RelatedProductComparisons;

  relativePerformanceGpus: GpuProduct[];
  relativeValueGpus: GpuProduct[];

  retailModels?: GpuProduct[];

  contentData: GpuContentData;
}

export interface GpuContentData {
  bestPerformanceGpu?: GpuProduct;
}
