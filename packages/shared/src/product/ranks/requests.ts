import { ProductType } from '../common';
import { ProductRanks } from './common';

//
// Update Product Ranks Request
//

export interface UpdateProductRanksRequest {
  productType: ProductType;
  ranks: Record<number, ProductRanks>;
}
