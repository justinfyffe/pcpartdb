import {
  GpuProduct,
  GpuProductComparison,
  ListGpusResponse,
  ProductType,
  RelatedProductComparisons,
  RelatedProducts,
} from '../product';

export interface CompareGpusAdditionalData {
  relativePerformanceGpus: GpuProduct[];
  relativeValueGpus: GpuProduct[];

  retailModels1?: GpuProduct[];
  retailModels2?: GpuProduct[];
}

export interface CompareGpusViewModel {
  comparison: GpuProductComparison;

  relatedGpus: RelatedProducts;
  relatedComparisons: RelatedProductComparisons;

  additionalData: CompareGpusAdditionalData;
}

export interface ListGpusViewModel extends ListGpusResponse {}

export interface ViewGpuAdditionalData {
  totalPerformanceGpus: number;

  relativePerformanceGpus?: GpuProduct[];
  relativeValueGpus?: GpuProduct[];

  bestPerformanceGpuForSegment?: GpuProduct;
  bestValueGpuForSegment?: GpuProduct;

  retailModels?: GpuProduct[];
}

export interface ViewGpuViewModel {
  gpu: GpuProduct;

  relatedGpus: RelatedProducts;
  relatedGpuComparisons: RelatedProductComparisons;

  additionalData: ViewGpuAdditionalData;
}

export interface GpuAdditionalData {
  productType: ProductType.Gpu;

  countPerformanceRanks?: number;
  countPerformanceRanksForMarketSegment?: number;

  bestPerformanceGpu?: GpuProduct;

  relativePerformanceGpus: GpuProduct[];
  relativeValueGpus: GpuProduct[];

  retailModels1?: GpuProduct[];
  retailModels2?: GpuProduct[];
}
