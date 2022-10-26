import Big from 'big.js';
import { format, parse } from 'date-fns';
import { Spec, SpecKey } from './spec-types';

export enum MarketSegmentValue {
  Desktop = 'DESKTOP',
  Laptop = 'LAPTOP',
  Server = 'SERVER',
}

export enum SpecBooleanFormatter {
  TrueFalse = 'TRUE_FALSE',
  YesNo = 'YES_NO',
}

export enum SpecDateFormatter {
  QuarterYear = 'QQQ yyyy',
}

export enum ClockSpeedUnit {
  KHz = 'KHz',
  MHz = 'MHz',
  GHz = 'GHz',
}

export enum StorageUnit {
  KB = 'KB',
  MB = 'MB',
  GB = 'GB',
  TB = 'TB',
}

export type MemoryUnit = StorageUnit;

export enum BandwidthUnit {
  Kbps = 'Kb/s',
  Mbps = 'Mb/s',
  Gbps = 'Gb/s',
}

export enum PixelFillRateUnit {
  GPixelps = 'GPixel/s',
}

export enum TextureFillRate {
  GTexelps = 'GTexel/s',
}

export function getSpecValue(spec: Spec) {
  return (
    spec?.booleanValue ??
    spec?.floatValue ??
    spec?.integerValue ??
    spec?.jsonValue ??
    spec?.stringValue ??
    spec?.textValue ??
    null
  );
}

const clockSpeedMultiplier: Record<ClockSpeedUnit, number> = {
  [ClockSpeedUnit.KHz]: 1_000,
  [ClockSpeedUnit.MHz]: 1_000_000,
  [ClockSpeedUnit.GHz]: 1_000_000_000,
};

const storageMultiplier: Record<StorageUnit, number> = {
  [StorageUnit.KB]: 1_000,
  [StorageUnit.MB]: 1_000_000,
  [StorageUnit.GB]: 1_000_000_000,
  [StorageUnit.TB]: 1_000_000_000_000,
};

const bandwidthMultiplier: Record<BandwidthUnit, number> = {
  [BandwidthUnit.Kbps]: 1_000,
  [BandwidthUnit.Mbps]: 1_000_000,
  [BandwidthUnit.Gbps]: 1_000_000_000,
};

const pixelFillRate: Record<PixelFillRateUnit, number> = {
  [PixelFillRateUnit.GPixelps]: 1_000_000_000,
};

const textureFillRate: Record<TextureFillRate, number> = {
  [TextureFillRate.GTexelps]: 1_000_000_000,
};

function specValueMultiplier(spec: Spec) {
  const { metadata } = spec;

  if (metadata?.suffix == null) {
    return 1;
  }

  const { suffix } = metadata;

  switch (suffix) {
    case ClockSpeedUnit.KHz:
    case ClockSpeedUnit.MHz:
    case ClockSpeedUnit.GHz:
      return clockSpeedMultiplier[suffix];
    case StorageUnit.KB:
    case StorageUnit.MB:
    case StorageUnit.GB:
    case StorageUnit.TB:
      return storageMultiplier[suffix];
    case BandwidthUnit.Kbps:
    case BandwidthUnit.Mbps:
    case BandwidthUnit.Gbps:
      return bandwidthMultiplier[suffix];
    case PixelFillRateUnit.GPixelps:
      return pixelFillRate[suffix];
    case TextureFillRate.GTexelps:
      return textureFillRate[suffix];
    default:
      return 1;
  }
}

export function compareSpecs(spec1: Spec, spec2: Spec) {
  const {
    key: key1,
    booleanValue: booleanValue1,
    floatValue: floatValue1,
    integerValue: integerValue1,
    jsonValue: jsonValue1,
    stringValue: stringValue1,
    textValue: textValue1,
  } = spec1;

  const {
    key: key2,
    booleanValue: booleanValue2,
    floatValue: floatValue2,
    integerValue: integerValue2,
    jsonValue: jsonValue2,
    stringValue: stringValue2,
    textValue: textValue2,
  } = spec2;

  // Check unsupported types
  if (key1 !== key2) {
    throw new Error('Cannot compare different types of specs');
  }

  if (booleanValue1 != null || booleanValue2 != null) {
    throw new Error('Cannot compare boolean specs');
  }

  if (jsonValue1 != null || jsonValue2 != null) {
    throw new Error('Cannot compare json specs');
  }

  // Handle text-based comparisons
  if (stringValue1 != null && stringValue2 != null) {
    return stringValue1.localeCompare(stringValue2);
  }

  if (textValue1 != null && textValue2 != null) {
    return textValue1.localeCompare(textValue2);
  }

  // Handle numberic-based comparisons
  if (integerValue1 != null && integerValue2 != null) {
    const value1 = Big(integerValue1).mul(specValueMultiplier(spec1));
    const value2 = Big(integerValue2).mul(specValueMultiplier(spec2));

    return value1.cmp(value2);
  }

  if (floatValue1 != null && floatValue2) {
    const value1 = Big(floatValue1).mul(specValueMultiplier(spec1));
    const value2 = Big(floatValue2).mul(specValueMultiplier(spec2));

    return value1.cmp(value2);
  }

  throw new Error('Cannot compare unknown speecs');
}

export interface FormatSpecOptions {
  decimals?: number;
  booleanFormatter?: SpecBooleanFormatter;
  dateFormatter?: SpecDateFormatter;
  prefix?: boolean;
  suffix?: boolean;
}

export function formatSpec(spec: Spec, options?: FormatSpecOptions) {
  if (getSpecValue(spec) == null) {
    return '--';
  }

  const {
    key,
    booleanValue,
    floatValue,
    integerValue,
    jsonValue,
    stringValue,
    textValue,
    metadata,
  } = spec;

  // Handle special cases
  if (key === SpecKey.MarketSegment) {
    return formatMarketSegment(stringValue);
  }
  if (key === SpecKey.ReleaseDate) {
    return formatReleaseDate(
      stringValue,
      options?.dateFormatter ?? SpecDateFormatter.QuarterYear,
    );
  }

  // Handle cases that we cannot output.
  if (jsonValue != null) {
    throw new Error('Cannot format a json value');
  }

  // Compute string to return
  let returnValue = '';
  if (booleanValue != null) {
    returnValue = formatBooleanValue(
      booleanValue,
      options?.booleanFormatter ?? SpecBooleanFormatter.TrueFalse,
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
  const prefix = metadata?.prefix ?? null;
  const suffix = metadata?.suffix ?? null;

  if ((options?.prefix ?? true) && prefix != null) {
    returnValue = `${prefix}${returnValue}`;
  }

  if ((options?.suffix ?? true) && suffix != null) {
    returnValue = `${returnValue} ${suffix}`;
  }

  return returnValue;
}

function formatBooleanValue(value: boolean, formatter: SpecBooleanFormatter) {
  if (formatter === SpecBooleanFormatter.TrueFalse) {
    return value ? 'True' : 'False';
  } else if (formatter === SpecBooleanFormatter.YesNo) {
    return value ? 'Yes' : 'No';
  } else {
    throw new Error(`Invalid boolean formatter: ${formatter}`);
  }
}

function formatMarketSegment(value: string) {
  switch (value) {
    case MarketSegmentValue.Desktop:
      return 'Desktop';
    case MarketSegmentValue.Laptop:
      return 'Laptop';
    case MarketSegmentValue.Server:
      return 'Server';
    default:
      throw new Error(`Invalid market segment value: ${value}`);
  }
}

function formatReleaseDate(value: string, formatter: SpecDateFormatter) {
  const date = parse(value, 'yyyy-MM-dd', new Date());
  return format(date, formatter);
}
