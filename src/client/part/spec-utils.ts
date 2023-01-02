import {
  BooleanFormatter,
  DateFormatter,
  formatBooleanValue,
  formatDate,
  formatPrice,
} from '@client/shared/format';
import { Part } from '@shared/part';
import { hasSpec, MarketSegmentValue, Spec } from '@shared/spec';

export function formatDimensions(part: Part) {
  const length = formatSpec(part.specs?.length);
  const height = formatSpec(part.specs?.height);
  const width = formatSpec(part.specs?.width);
  const slots = formatSpec(part.specs?.slotWidth);

  if (length == null || width == null) {
    return null;
  }

  if (height != null) {
    return `${length} (L) x ${width} (W) x ${height} (H)`;
  }

  if (slots != null) {
    return `${length} (L) x ${width} (W) x ${slots} (H)`;
  }

  return null;
}

export interface FormatSpecOptions {
  decimals?: number;
  booleanFormatter?: BooleanFormatter;
  dateFormatter?: DateFormatter;
  showUnits?: boolean;
}

export function formatSpec(spec: Spec, options?: FormatSpecOptions) {
  if (!hasSpec(spec)) {
    return null;
  }

  const { value, metadata } = spec;
  const specKey = metadata?.specKey;

  // Handle special cases
  if (specKey === 'launchPrice') {
    return formatPrice(spec.value as number, {
      ...options,
      currency: spec.metadata?.unit,
    });
  }
  if (specKey === 'slotWidth' && typeof spec.value === 'number') {
    return `${spec.value}-slot`;
  }
  if (specKey === 'marketSegment') {
    return formatMarketSegment(value as MarketSegmentValue);
  }
  if (specKey === 'releaseDate') {
    return formatDate(value as string, { formatter: options?.dateFormatter });
  }
  if (specKey === 'openClVersion' && typeof spec.value === 'number') {
    return spec.value.toFixed(1);
  }
  if (specKey === 'openGlVersion' && typeof spec.value === 'number') {
    return spec.value.toFixed(1);
  }
  if (specKey === 'shaderModelVersion' && typeof spec.value === 'number') {
    return spec.value.toFixed(1);
  }

  // Compute string to return
  let returnValue: string = null;
  if (typeof value === 'boolean') {
    returnValue = formatBooleanValue(value);
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
  const unit = metadata?.unit ?? null;

  if ((options?.showUnits ?? true) && unit != null) {
    returnValue = `${returnValue} ${unit}`;
  }

  return returnValue;
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
