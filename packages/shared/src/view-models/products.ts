import { Product, ProductType, ProductUpdate } from '../product';
import { CpuAdditionalData } from './cpus';
import { GpuAdditionalData } from './gpus';

export interface AdminEditProductViewModel {
  productType: ProductType;
  product: Product;
  pendingUpdate: ProductUpdate;
}

export type ProductAdditionalData = CpuAdditionalData | GpuAdditionalData;
