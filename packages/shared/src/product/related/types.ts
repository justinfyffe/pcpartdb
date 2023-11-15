import { Product } from '../types';

export enum RelatedProductType {
  PerformanceRating = 'PERFORMANCE_RATING',
  PerformancePerMsrp = 'PERFORMANCE_PER_MSRP',
}

export interface RelatedProduct {
  id?: number;
  productId?: number;

  type: RelatedProductType;
  relatedProductId: number;

  relatedProduct?: Partial<Product>;
}
