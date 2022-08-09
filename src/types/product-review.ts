import { schema } from 'normalizr';

export enum ProductReviewKey {
  TomsHardware = 'TOMS_HARDWARE',
}

export interface ProductReview {
  source?: string;
  key: ProductReviewKey;
  value?: number | string;
}

export const productReviewSchema = new schema.Entity('productReview');
