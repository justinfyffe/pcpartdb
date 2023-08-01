import { Product, ProductType, ProductUpdate } from '../product';

export interface AdminEditProductViewModel {
  productType: ProductType;
  product: Product;
  pendingUpdate: ProductUpdate;
}
