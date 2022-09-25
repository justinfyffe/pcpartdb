import { schema } from 'normalizr';

export enum ProductReviewKey {
  Amazon = 'AMAZON',
  PcGamer = 'PC_GAMER',
  TechRadar = 'TECH_RADAR',
  TechSpot = 'TECH_SPOT',
  TomsHardware = 'TOMS_HARDWARE',
}

export interface ProductReview {
  id?: number;
  productId?: number;

  key: ProductReviewKey;
  value: string;
  source?: string;
}

export interface ProductReviewRequest {
  key: ProductReviewKey;
  value: string;
  source?: string;
}

export const productReviewSchema = new schema.Entity('productReview');
