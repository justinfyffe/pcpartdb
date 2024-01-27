import { Product, ProductComparison } from '../common';

// Enums

export enum RelatedProductType {
  Performance = 'performance',
  Value = 'value',
}

// Types

export interface RelatedProduct {
  productId?: number;
  relatedProductId: number;
  relatedProductKey: string;

  relatedProduct?: Partial<Product>;
}

export type RelatedProducts = Partial<Record<string, Partial<Product>[]>>;

export interface RelatedProductComparisons {
  comparisons: ProductComparison[];
}
