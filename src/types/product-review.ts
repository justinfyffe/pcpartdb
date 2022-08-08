import { schema } from 'normalizr';

export enum ProductReviewKey {
  TomsHardware = 'TOMS_HARDWARE',
}

export interface ProductReview<T = unknown> {
  source?: string;
  key: ProductReviewKey;
  value?: T;
}

export const productReviewSchema = new schema.Entity('productReview');
