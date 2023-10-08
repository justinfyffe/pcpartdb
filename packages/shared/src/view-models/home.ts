import {
  GpuProduct,
  GpuProductComparison,
  Product,
  ProductComparison,
} from '../product';

export interface HomeViewModel {
  nvidiaVsAmdGpus: GpuProductComparison[];
  popularGpus: GpuProduct[];

  intelVsAmdCpus: ProductComparison[];
  popularCpus: Product[];
}
