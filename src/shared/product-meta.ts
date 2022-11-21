import Joi from '@hapi/joi';
import { RetailModel } from './retail-model';

export enum ProductMetaBooleanFormatter {
  TrueFalse = 'TRUE_FALSE',
  YesNo = 'YES_NO',
}

export interface ProductMetas {
  // Generated Meta Values
  performanceRank?: ProductMeta<number>;
  valueRank?: ProductMeta<number>;

  // Persisted Meta Values
  description?: ProductMeta<string>;
  retailModels?: ProductMeta<RetailModel[]>;
}

export type ProductMetasRequest = ProductMetas;
export type ProductMetaKey = keyof ProductMetas;

export interface ProductMetaMetadata {
  metaKey?: ProductMetaKey;
}

export interface ProductMeta<T = unknown> {
  value?: T;
  source?: string;
  metadata?: ProductMetaMetadata;
}

export const productMetaValidator = Joi.object({
  value: Joi.any().allow(null),
  source: Joi.string().allow(null),
  metadata: Joi.any().allow(null),
}).options({ abortEarly: false });

export const productMetasValidator = Joi.object({
  performanceRank: productMetaValidator.allow(null),
  valueRank: productMetaValidator.allow(null),

  description: productMetaValidator.allow(null),
  retailModels: productMetaValidator.allow(null),
});

export interface FormatMetaOptions {
  decimals?: number;
  booleanFormatter?: ProductMetaBooleanFormatter;
  ordinalSuffix?: boolean;
}

export function formatProductMeta(
  meta: ProductMeta,
  options?: FormatMetaOptions,
) {
  if (meta == null) {
    return null;
  }

  const { value } = meta;
  if (value == null) {
    return null;
  }

  // Handle special cases

  // Compute string to return
  let returnValue: string = null;
  if (typeof value === 'boolean') {
    returnValue = formatBooleanValue(
      value,
      options?.booleanFormatter ?? ProductMetaBooleanFormatter.TrueFalse,
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
  if (options?.ordinalSuffix && typeof value === 'number') {
    const ordinalSuffix = getOrdinalSuffix(value as number);
    returnValue = `${returnValue}${ordinalSuffix}`;
  }

  return returnValue;
}

function formatBooleanValue(
  value: boolean,
  formatter: ProductMetaBooleanFormatter,
) {
  if (formatter === ProductMetaBooleanFormatter.TrueFalse) {
    return value ? 'True' : 'False';
  } else if (formatter === ProductMetaBooleanFormatter.YesNo) {
    return value ? 'Yes' : 'No';
  } else {
    throw new Error(`Invalid boolean formatter: ${formatter}`);
  }
}

function getOrdinalSuffix(value: number) {
  const ones = value % 10;
  const tens = value % 100;
  if (ones == 1 && tens != 11) {
    return 'st';
  } else if (ones == 2 && tens != 12) {
    return 'nd';
  } else if (ones == 3 && tens != 13) {
    return 'rd';
  } else {
    return 'th';
  }
}
