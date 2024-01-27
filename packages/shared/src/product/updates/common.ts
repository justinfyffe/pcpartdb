import { Product, ProductType, SubProductType } from '../common';

// Enums

export enum ProductUpdateStatus {
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  Approved = 'APPROVED',
}

// Types

export interface ProductDiff {
  original?: Product;
  updated?: Product;
}

/**
 * Data structure containing information regarding data updates for a
 * product. This could include a new or existing product.
 */
export interface ProductUpdate<T = ProductDiff> {
  id?: number;

  productType: ProductType;
  subProductType?: SubProductType;
  productName: string;

  status: ProductUpdateStatus;
  description?: string;

  data?: T;
  metadata?: ProductUpdateMeta;

  productId?: number;

  startedAt?: number;
  finishedAt?: number;
}
export interface ProductUpdateMeta {}
