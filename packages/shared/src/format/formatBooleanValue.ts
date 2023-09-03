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
