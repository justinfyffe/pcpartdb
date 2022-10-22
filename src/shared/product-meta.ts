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

export function productMetaValue(meta: ProductMeta) {
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

export interface FormatProductMetaOptions {
  decimals?: number;
  booleanFormatter?: ProductMetaBooleanFormatter;
}

export function formatProductMeta(
  meta: ProductMeta,
  options?: FormatProductMetaOptions,
) {
  if (productMetaValue(meta) == null) {
    return '--';
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
  let returnValue = '';
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

  // Apply modifiers

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
