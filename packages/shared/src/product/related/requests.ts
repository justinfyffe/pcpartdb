import { ProductType } from '../common';
import { RelatedProducts } from './common';

//
// Update Related Products Request
//

export interface UpdateRelatedProductsRequest {
  productType: ProductType;
  relatedProducts: Record<number, RelatedProducts>;
}
