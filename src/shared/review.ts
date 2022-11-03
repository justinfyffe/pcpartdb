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

export interface FormatReviewOptions {
  decimals?: number;
  booleanFormatter?: ReviewBooleanFormatter;
}

export function formatReview(review: Review, options?: FormatReviewOptions) {
  const { value } = review;
  if (value == null) {
    return null;
  }

  // Handle special cases

  // Compute string to return
  let returnValue: string = null;
  if (typeof value === 'boolean') {
    returnValue = formatBooleanValue(
      value,
      options?.booleanFormatter ?? ReviewBooleanFormatter.TrueFalse,
    );
  } else if (typeof value === 'number' && Number.isInteger(value)) {
    returnValue = value.toLocaleString();
  } else if (typeof value === 'number' && !Number.isInteger(value)) {
    returnValue = value.toLocaleString(undefined, {
      minimumFractionDigits: options?.decimals ?? 0,
      maximumFractionDigits: options?.decimals ?? 0,
    });
  } else if (typeof value === 'string') {
    returnValue = value;
  } else {
    return null;
  }

  if (returnValue == null) {
    return null;
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
