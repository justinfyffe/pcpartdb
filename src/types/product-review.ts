import Joi from '@hapi/joi';
import { schema } from 'normalizr';

export enum ProductReviewKey {
  Amazon = 'AMAZON',
  PcGamer = 'PC_GAMER',
  TechRadar = 'TECH_RADAR',
  TechSpot = 'TECH_SPOT',
  TomsHardware = 'TOMS_HARDWARE',
}

export interface ProductReviewMetadata {}

export interface ProductReview {
  key: ProductReviewKey;

  integerValue?: number;
  floatValue?: number;
  booleanValue?: boolean;
  stringValue?: string;
  textValue?: string;
  jsonValue?: unknown;

  metadata?: ProductReviewMetadata;
  source?: string;
}

export interface ProductReviewRequest {
  key: ProductReviewKey;

  integerValue?: number;
  floatValue?: number;
  booleanValue?: boolean;
  stringValue?: string;
  textValue?: string;
  jsonValue?: unknown;

  metadata?: ProductReviewMetadata;
  source?: string;
}

export const productReviewSchema = new schema.Entity('productReview');

export const productReviewValidator = Joi.object({
  key: Joi.string().required(),

  integerValue: Joi.number().allow(null),
  floatValue: Joi.number().allow(null),
  booleanValue: Joi.boolean().allow(null),
  stringValue: Joi.string().allow(null),
  textValue: Joi.string().allow(null),
  jsonValue: Joi.any().allow(null),

  source: Joi.string().allow(null),
  metadata: Joi.any().allow(null),
}).options({ abortEarly: false });
