import { PartMeta, PartMetaBooleanFormatter } from './part-meta-types';

export interface FormatMetaOptions {
  decimals?: number;
  booleanFormatter?: PartMetaBooleanFormatter;
  ordinalNumber?: boolean;
}

export function formatPartMeta(meta: PartMeta, options?: FormatMetaOptions) {
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
      options?.booleanFormatter ?? PartMetaBooleanFormatter.TrueFalse,
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
  if (options?.ordinalNumber && typeof value === 'number') {
    const ordinalSuffix = getOrdinalSuffix(value as number);
    returnValue = `${returnValue}${ordinalSuffix}`;
  }

  return returnValue;
}

function formatBooleanValue(
  value: boolean,
  formatter: PartMetaBooleanFormatter,
) {
  if (formatter === PartMetaBooleanFormatter.TrueFalse) {
    return value ? 'True' : 'False';
  } else if (formatter === PartMetaBooleanFormatter.YesNo) {
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
