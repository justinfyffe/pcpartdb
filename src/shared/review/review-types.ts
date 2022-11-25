import Joi from '@hapi/joi';

export enum ReviewBooleanFormatter {
  TrueFalse = 'TRUE_FALSE',
  YesNo = 'YES_NO',
}

export interface Reviews {
  amazon?: Review<number>;
  pcGamer?: Review<number>;
  techRadar?: Review<number>;
  techSpot?: Review<number>;
  tomsHardware?: Review<number>;
}

export type ReviewsRequest = Reviews;
export type ReviewKey = keyof Reviews;

export interface ReviewMetadata {
  reviewKey?: ReviewKey;
}

export interface Review<T = unknown> {
  value?: T;
  source?: string;
  metadata?: ReviewMetadata;
}

export const reviewValidator = Joi.object({
  value: Joi.any().allow(null),
  source: Joi.string().allow(null),
  metadata: Joi.any().allow(null),
}).options({ abortEarly: false });

export const reviewsValidator = Joi.object({
  amazon: reviewValidator.allow(null),
  pcGamer: reviewValidator.allow(null),
  techRadar: reviewValidator.allow(null),
  techSpot: reviewValidator.allow(null),
  tomsHardware: reviewValidator.allow(null),
}).options({ abortEarly: false });
