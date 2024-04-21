import { Product, ProductType, ProductUpdate } from '../product';
import { ViewCpuViewModel } from './cpus';
import { ViewGpuViewModel } from './gpus';

export interface AdminEditProductViewModel {
  productType: ProductType;
  product: Product;
  pendingUpdate: ProductUpdate;
}

export type ViewProductViewModel = ViewCpuViewModel | ViewGpuViewModel;
