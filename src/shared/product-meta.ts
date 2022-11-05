import Joi from '@hapi/joi';

export enum ProductMetaBooleanFormatter {
  TrueFalse = 'TRUE_FALSE',
  YesNo = 'YES_NO',
}

export enum ProductMetaKey {
  // Generated Meta Values
  PerformanceRank = 'PERFORMANCE_RANK',
  ValueRank = 'VALUE_RANK',

  // Persisted Meta Values
  Description = 'DESCRIPTION',
  RetailModels = 'RETAIL_MODELS',
}

export interface ProductMetaMetadata {}

export interface ProductMeta {
  key: ProductMetaKey;

  integerValue?: number;
  floatValue?: number;
  booleanValue?: boolean;
  stringValue?: string;
  textValue?: string;
  jsonValue?: unknown;

  source?: string;
  metadata?: ProductMetaMetadata;
}

export type ProductMetaRequest = ProductMeta;

export type ProductMetaMap = Partial<Record<ProductMetaKey, ProductMeta>>;

export const productMetaValidator = Joi.object({
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

export function getProductMetaValue(meta: ProductMeta) {
  return (
    meta?.booleanValue ??
    meta?.floatValue ??
    meta?.integerValue ??
    meta?.jsonValue ??
    meta?.stringValue ??
    meta?.textValue ??
    null
  );
}

export interface FormatMetaOptions {
  decimals?: number;
  booleanFormatter?: ProductMetaBooleanFormatter;
  ordinalSuffix?: boolean;
}

export function formatProductMeta(
  meta: ProductMeta,
  options?: FormatMetaOptions,
) {
  if (getProductMetaValue(meta) == null) {
    return null;
  }

  const {
    booleanValue,
    floatValue,
    integerValue,
    jsonValue,
    stringValue,
    textValue,
  } = meta;

  // Handle special cases

  // Handle cases that we cannot output.
  if (jsonValue != null) {
    throw new Error('Cannot format a json value');
  }

  // Compute string to return
  let returnValue = null;
  if (booleanValue != null) {
    returnValue = formatBooleanValue(
      booleanValue,
      options?.booleanFormatter ?? ProductMetaBooleanFormatter.TrueFalse,
    );
  } else if (floatValue != null) {
    returnValue = floatValue.toLocaleString(undefined, {
      minimumFractionDigits: options?.decimals ?? 0,
      maximumFractionDigits: options?.decimals ?? 0,
    });
  } else if (integerValue != null) {
    returnValue = integerValue.toLocaleString();
  } else if (stringValue != null) {
    returnValue = stringValue;
  } else if (textValue != null) {
    returnValue = textValue;
  }

  if (returnValue == null) {
    return null;
  }

  // Apply modifiers
  if (options?.ordinalSuffix && integerValue != null) {
    const ordinalSuffix = getOrdinalSuffix(integerValue);
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
