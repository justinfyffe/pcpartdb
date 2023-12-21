import { Product } from '../types';

export enum RelatedProductType {
  Performance = 'performance',
  Value = 'value',
}

export type RelatedProducts = Partial<Record<string, Partial<Product>[]>>;

export interface RelatedProduct {
  productId?: number;
  relatedProductId: number;
  relatedProductKey: string;

  relatedProduct?: Partial<Product>;
}
