import { schema } from 'normalizr';

export enum ProductReviewKey {
  TomsHardware = 'TOMS_HARDWARE',
}

export interface ProductReview {
  id?: number;
  productId?: number;

  source?: string;
  key: ProductReviewKey;
  value?: string;
}

export const productReviewSchema = new schema.Entity('productReview');
