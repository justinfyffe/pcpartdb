import {
  BooleanFormatter,
  DateFormatter,
  formatBooleanValue,
  formatDate,
  formatPrice,
} from '@client/shared/format';
import {
  calculateDisplayGpuFieldValue,
  getUnitFormat,
  Gpu,
  GpuComparison,
  GpuField,
  MarketSegmentValue,
} from '@shared/gpus';

interface GetGpuNameOptions {
  company?: boolean;
}

export function getGpuName(gpu: Gpu, options?: GetGpuNameOptions) {
  if (gpu == null) {
    return null;
  }

  const includeCompany = options?.company ?? true;
  const company = includeCompany ? gpu.company?.value ?? null : null;

  return company != null ? `${company} ${gpu.name}` : gpu.name;
}

interface GetGpuComparisonNameOptions {
  company?: boolean;
}

export function getGpuComparisonName(
  comparison: GpuComparison,
  options?: GetGpuComparisonNameOptions,
) {
  const [gpu1, gpu2] = comparison;
  if (gpu1 == null || gpu2 == null) {
    return null;
  }

  return `${getGpuName(gpu1, options)} vs ${getGpuName(gpu2, options)}`;
}

export function getViewGpuSlug(gpu: Gpu) {
  return gpu.slug;
}

interface GetGpuComparisonSlugOptions {
  ordered?: boolean;
}

export function getCompareGpusSlug(
  comparison: GpuComparison,
  options?: GetGpuComparisonSlugOptions,
) {
  const [gpu1, gpu2] =
    options?.ordered === true
      ? [...comparison].sort((p1, p2) => p1.id - p2.id)
      : comparison;
  return `${gpu1.slug}--vs--${gpu2.slug}`;
}

export function getShoppingUrl(gpu: Gpu) {
  return gpu.affiliateUrl ?? null;
}

export function formatGpuDimensions(gpu: Gpu) {
  const length = formatGpuField(gpu.specs?.length);
  const height = formatGpuField(gpu.specs?.height);
  const width = formatGpuField(gpu.specs?.width);
  const slots = formatGpuField(gpu.specs?.slotWidth);

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

export interface FormatGpuFieldOptions {
  decimals?: number;
  booleanFormatter?: BooleanFormatter;
  dateFormatter?: DateFormatter;
  showUnits?: boolean;
}

export function formatGpuField(
  field: GpuField,
  options?: FormatGpuFieldOptions,
) {
  if (field?.value == null) {
    return null;
  }

  const { value, meta } = field;
  const fieldKey = meta?.fieldKey;

  // Handle special cases
  if (fieldKey === 'launchPrice') {
    return formatPrice(field.value as number, {
      ...options,
      currency: field.meta?.currency,
    });
  }
  if (fieldKey === 'slotWidth' && typeof field.value === 'number') {
    return `${field.value}-slot`;
  }
  if (fieldKey === 'marketSegment') {
    return formatMarketSegment(value as MarketSegmentValue);
  }
  if (fieldKey === 'releaseDate') {
    return formatDate(value as string, { formatter: options?.dateFormatter });
  }
  if (fieldKey === 'openClVersion' && typeof field.value === 'number') {
    return field.value.toFixed(1);
  }
  if (fieldKey === 'openGlVersion' && typeof field.value === 'number') {
    return field.value.toFixed(1);
  }
  if (fieldKey === 'shaderModelVersion' && typeof field.value === 'number') {
    return field.value.toFixed(1);
  }

  // Compute string to return
  let returnValue: string = null;
  const unit = meta?.unit ?? null;
  if (typeof value === 'boolean') {
    returnValue = formatBooleanValue(value);
  } else if (typeof value === 'number' && Number.isInteger(value)) {
    returnValue = calculateDisplayGpuFieldValue(value, unit).toLocaleString();
  } else if (typeof value === 'number' && !Number.isInteger(value)) {
    returnValue = calculateDisplayGpuFieldValue(value, unit).toLocaleString(
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
  if ((options?.showUnits ?? true) && unit != null) {
    const formattedUnit = getUnitFormat(unit);
    returnValue = `${returnValue} ${formattedUnit}`;
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
    case MarketSegmentValue.Workstation:
      return 'Workstation';
    default:
      throw new Error(`Invalid market segment value: ${value}`);
  }
}
