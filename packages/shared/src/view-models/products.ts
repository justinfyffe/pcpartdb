import { Product, ProductType, ProductUpdate } from '../product';
import { CpuContentData, ViewCpuViewModel } from './cpus';
import { GpuContentData, ViewGpuViewModel } from './gpus';

export interface AdminEditProductViewModel {
  productType: ProductType;
  product: Product;
  pendingUpdate: ProductUpdate;
}

export type ViewProductViewModel = ViewCpuViewModel | ViewGpuViewModel;

export type ProductContentData = CpuContentData | GpuContentData;
