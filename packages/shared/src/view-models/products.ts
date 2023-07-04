import { Product, ProductType } from '../product';

export interface AdminEditProductViewModel {
  productType: ProductType;
  product: Product;
}
