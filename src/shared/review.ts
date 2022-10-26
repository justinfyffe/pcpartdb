import Joi from '@hapi/joi';

export enum ReviewBooleanFormatter {
  TrueFalse = 'TRUE_FALSE',
  YesNo = 'YES_NO',
}

export enum ReviewKey {
  Amazon = 'AMAZON',
  PcGamer = 'PC_GAMER',
  TechRadar = 'TECH_RADAR',
  TechSpot = 'TECH_SPOT',
  TomsHardware = 'TOMS_HARDWARE',
}

export interface ReviewMetadata {}

export interface Review {
  key: ReviewKey;

  integerValue?: number;
  floatValue?: number;
  booleanValue?: boolean;
  stringValue?: string;
  textValue?: string;
  jsonValue?: unknown;

  metadata?: ReviewMetadata;
  source?: string;
}

export type ReviewRequest = Review;

export type ReviewMap = Partial<Record<ReviewKey, Review>>;

export const reviewValidator = Joi.object({
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

export function getReviewValue(review: Review) {
  return (
    review?.booleanValue ??
    review?.floatValue ??
    review?.integerValue ??
    review?.jsonValue ??
    review?.stringValue ??
    review?.textValue ??
    null
  );
}

export interface FormatReviewOptions {
  decimals?: number;
  booleanFormatter?: ReviewBooleanFormatter;
}

export function formatReview(review: Review, options?: FormatReviewOptions) {
  if (getReviewValue(review) == null) {
    return '--';
  }

  const {
    booleanValue,
    floatValue,
    integerValue,
    jsonValue,
    stringValue,
    textValue,
  } = review;

  // Handle special cases

  // Handle cases that we cannot output.
  if (jsonValue != null) {
    throw new Error('Cannot format a json value');
  }

  // Compute string to return
  let returnValue = '';
  if (booleanValue != null) {
    returnValue = formatBooleanValue(
      booleanValue,
      options?.booleanFormatter ?? ReviewBooleanFormatter.TrueFalse,
    );
  } else if (floatValue != null) {
    returnValue = floatValue.toLocaleString(undefined, {
      minimumFractionDigits: options?.decimals ?? 2,
      maximumFractionDigits: options?.decimals ?? 2,
    });
  } else if (integerValue != null) {
    returnValue = integerValue.toLocaleString();
  } else if (stringValue != null) {
    returnValue = stringValue;
  } else if (textValue != null) {
    returnValue = textValue;
  }

  // Apply modifiers

  return returnValue;
}

function formatBooleanValue(value: boolean, formatter: ReviewBooleanFormatter) {
  if (formatter === ReviewBooleanFormatter.TrueFalse) {
    return value ? 'True' : 'False';
  } else if (formatter === ReviewBooleanFormatter.YesNo) {
    return value ? 'Yes' : 'No';
  } else {
    throw new Error(`Invalid boolean formatter: ${formatter}`);
  }
}
