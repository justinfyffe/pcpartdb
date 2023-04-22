import { format, parse } from 'date-fns';

export function formatOrdinalNumber(value: number | string) {
  const num = Number(value);

  if (Number.isNaN(num)) {
    return null;
  }

  let suffix = '';
  const ones = num % 10;
  const tens = num % 100;
  if (ones == 1 && tens != 11) {
    suffix = 'st';
  } else if (ones == 2 && tens != 12) {
    suffix = 'nd';
  } else if (ones == 3 && tens != 13) {
    suffix = 'rd';
  } else {
    suffix = 'th';
  }

  return `${num}${suffix}`;
}

interface FormatPriceOptions {
  decimals?: number;
  currency?: string;
}

export function formatPrice(value: number, options?: FormatPriceOptions) {
  const decimals = options?.decimals ?? 0;
  const currency = options?.currency?.toUpperCase() ?? 'USD';

  const ret = value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  if (currency === 'USD') {
    return `$${ret}`;
  } else {
    return `${ret} ${currency}`;
  }
}

export enum DateFormatter {
  QuarterYear = 'QQQ yyyy',
  Year = 'yyyy',
  YearQuarter = 'yyyy QQQ',
}

interface FormatDateOptions {
  formatter?: DateFormatter;
}

export function formatDate(value: string, options?: FormatDateOptions) {
  const formatter = options?.formatter ?? DateFormatter.QuarterYear;
  const date = parse(value, 'yyyy-MM-dd', new Date());
  return format(date, formatter);
}

export enum BooleanFormatter {
  TrueFalse = 'TRUE_FALSE',
  YesNo = 'YES_NO',
}

interface FormatBooleanOptions {
  formatter?: BooleanFormatter;
}

export function formatBooleanValue(
  value: boolean,
  options?: FormatBooleanOptions,
) {
  const formatter = options?.formatter ?? BooleanFormatter.TrueFalse;

  if (formatter === BooleanFormatter.TrueFalse) {
    return value ? 'True' : 'False';
  } else if (formatter === BooleanFormatter.YesNo) {
    return value ? 'Yes' : 'No';
  } else {
    throw new Error(`Invalid boolean formatter: ${formatter}`);
  }
}
