import { format, parse } from 'date-fns';

export enum DateFormat {
  QuarterYear = 'QQQ yyyy',
  Year = 'yyyy',
  YearQuarter = 'yyyy QQQ',
}

interface FormatDateOptions {
  format?: DateFormat;
}

export function formatDate(value: string, options?: FormatDateOptions) {
  const formatter = options?.format ?? DateFormat.QuarterYear;
  const date = parse(value, 'yyyy-MM-dd', new Date());
  return format(date, formatter);
}
