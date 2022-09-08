import { schema } from 'normalizr';

export interface ProductImage {
  productId: number;
  imageId: number;
  metadata?: unknown;
}

export const productImageSchema = new schema.Entity('productImages');
