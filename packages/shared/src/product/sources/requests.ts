import { ProductType } from '../common';

//
// Apply Sources to Product Request
//

export interface ApplyAutomationSourcesToProductRequest {
  productType: ProductType;
  productId: number;
  sources: number[];
}
