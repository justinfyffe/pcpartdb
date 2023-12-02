import { Product, ProductType, ProductUpdate } from '../product';
import { CpuContentData } from './cpus';
import { GpuContentData } from './gpus';

export interface AdminEditProductViewModel {
  productType: ProductType;
  product: Product;
  pendingUpdate: ProductUpdate;
}

export type ProductContentData = CpuContentData | GpuContentData;
