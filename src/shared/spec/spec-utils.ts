import Big from 'big.js';
import { format, parse } from 'date-fns';
import { MarketSegmentValue, Spec, SpecFormat } from './spec-types';

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
  // Check unsupported types
  if (spec1.metadata?.specKey !== spec2.metadata?.specKey) {
    throw new Error('Cannot compare different specs');
  }

  if (typeof spec1.value !== typeof spec2.value) {
    throw new Error('Cannot compare specs of different values');
  }

  // Handle text-based comparisons
  if (typeof spec1.value === 'string' && typeof spec2.value === 'string') {
    return spec1.value.localeCompare(spec2.value);
  }

  // Handle numberic-based comparisons
  if (typeof spec1.value === 'number' && typeof spec2.value === 'number') {
    const value1 = Big(spec1.value).mul(specValueMultiplier(spec1));
    const value2 = Big(spec2.value).mul(specValueMultiplier(spec2));

    return value1.cmp(value2);
  }

  throw new Error(`Cannot compare specs of type '${typeof spec1.value}'`);
}

export interface FormatSpecOptions {
  decimals?: number;
  booleanFormatter?: SpecBooleanFormatter;
  dateFormatter?: SpecDateFormatter;
  prefix?: boolean;
  suffix?: boolean;
}

export function formatSpec(spec: Spec, options?: FormatSpecOptions) {
  const { value, metadata } = spec;
  if (value == null) {
    return null;
  }

  // Handle special cases
  if (metadata.format === SpecFormat.MarketSegment) {
    return formatMarketSegment(value as MarketSegmentValue);
  }
  if (metadata.format === SpecFormat.Date) {
    return formatDate(
      value as string,
      options?.dateFormatter ?? SpecDateFormatter.QuarterYear,
    );
  }

  // Compute string to return
  let returnValue: string = null;
  if (typeof value === 'boolean') {
    returnValue = formatBooleanValue(
      value,
      options?.booleanFormatter ?? SpecBooleanFormatter.YesNo,
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

function formatMarketSegment(value: MarketSegmentValue) {
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

function formatDate(value: string, formatter: SpecDateFormatter) {
  const date = parse(value, 'yyyy-MM-dd', new Date());
  return format(date, formatter);
}
