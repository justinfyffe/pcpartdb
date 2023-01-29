import {
  BooleanFormatter,
  DateFormatter,
  formatBooleanValue,
  formatDate,
  formatPrice,
} from '@client/shared/format';
import { Gpu, GpuSpec, MarketSegmentValue } from '@shared/gpus';
import { getDisplayGpuSpecValue } from '@shared/gpus/gpu-spec-utils';

export function formatGpuDimensions(gpu: Gpu) {
  const length = formatGpuSpec(gpu.specs?.length);
  const height = formatGpuSpec(gpu.specs?.height);
  const width = formatGpuSpec(gpu.specs?.width);
  const slots = formatGpuSpec(gpu.specs?.slotWidth);

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

export interface FormatGpuSpecOptions {
  decimals?: number;
  booleanFormatter?: BooleanFormatter;
  dateFormatter?: DateFormatter;
  showUnits?: boolean;
}

export function formatGpuSpec(spec: GpuSpec, options?: FormatGpuSpecOptions) {
  if (spec?.value == null) {
    return null;
  }

  const { value, meta } = spec;
  const specKey = meta?.specKey;

  // Handle special cases
  if (specKey === 'launchPrice') {
    return formatPrice(spec.value as number, {
      ...options,
      currency: spec.meta?.currency,
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
  const displayUnit = meta?.displayUnit ?? null;
  if (typeof value === 'boolean') {
    returnValue = formatBooleanValue(value);
  } else if (typeof value === 'number' && Number.isInteger(value)) {
    returnValue = getDisplayGpuSpecValue(value, displayUnit).toLocaleString();
  } else if (typeof value === 'number' && !Number.isInteger(value)) {
    returnValue = getDisplayGpuSpecValue(value, displayUnit).toLocaleString(
      undefined,
      {
        minimumFractionDigits: options?.decimals ?? 0,
        maximumFractionDigits: options?.decimals ?? 0,
      },
    );
  } else if (typeof value === 'string') {
    returnValue = value;
  } else {
    return null;
  }

  if (returnValue == null) {
    return null;
  }

  // Apply modifiers
  if ((options?.showUnits ?? true) && displayUnit != null) {
    returnValue = `${returnValue} ${displayUnit}`;
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
