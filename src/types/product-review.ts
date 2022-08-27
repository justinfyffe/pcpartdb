import { schema } from 'normalizr';

export enum ProductReviewKey {
  TomsHardware = 'TOMS_HARDWARE',
}

export type ProductReviewValue = number | string;

export interface ProductReview {
  id?: number;
  productId?: number;

  source?: string;
  key: ProductReviewKey;
  value?: ProductReviewValue;
}

export const productReviewSchema = new schema.Entity('productReview');
