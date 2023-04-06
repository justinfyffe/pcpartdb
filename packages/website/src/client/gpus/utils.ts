import { boolean } from '@hapi/joi';
import {
  calculateDisplayGpuFieldValue,
  getUnitFormat,
  Gpu,
  GpuComparison,
  GpuField,
  MarketSegmentValue,
} from '@pcpartdb/shared';
import {
  BooleanFormatter,
  DateFormatter,
  formatBooleanValue,
  formatDate,
  formatPrice,
} from '../shared/format';

interface GetGpuNameOptions {
  company?: boolean;
}

export function getGpuName(gpu: Gpu, options?: GetGpuNameOptions) {
  if (gpu == null) {
    return null;
  }

  const includeCompany = options?.company ?? true;
  const company = includeCompany ? formatGpuField(gpu.company) : null;

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

export function formatGpuCompany(company: string) {
  if (company == null) {
    return null;
  }

  switch (company.toLowerCase()) {
    case 'amd':
      return 'AMD';
    case 'intel':
      return 'Intel';
    case 'nvidia':
      return 'NVIDIA';
    default:
      return company;
  }
}

interface FormatGpuDimensionsOptions {
  allowMissingDimensions?: boolean;
}

export function formatGpuDimensions(
  gpu: Gpu,
  options?: FormatGpuDimensionsOptions,
) {
  const length = formatGpuField(gpu.specs?.length);
  const height = formatGpuField(gpu.specs?.height);
  const width = formatGpuField(gpu.specs?.width);
  const slots = formatGpuField(gpu.specs?.slotWidth);

  const dimensions: string[] = [];
  dimensions.push(length != null ? `${length} (L)` : null);
  dimensions.push(width != null ? `${width} (W)` : null);
  if (height != null) {
    dimensions.push(`${height} (H)`);
  } else if (slots != null) {
    dimensions.push(`${slots} (H)`);
  }

  if (options?.allowMissingDimensions === false && dimensions.includes(null)) {
    return null;
  }

  return dimensions.filter((value) => value != null).join(' x ') || null;
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
  if (fieldKey === 'company' && typeof value === 'string') {
    return formatGpuCompany(value);
  } else if (fieldKey === 'launchPrice' && typeof value === 'number') {
    return formatPrice(value, { ...options, currency: field.meta?.currency });
  }
  if (fieldKey === 'slotWidth' && typeof value === 'number') {
    if (options?.showUnits === false) {
      return `${value}`;
    }
    return value === 1 ? `${value} slot` : `${value} slots`;
  }
  if (fieldKey === 'marketSegment') {
    return formatMarketSegment(value as MarketSegmentValue);
  }
  if (fieldKey === 'releaseDate' && typeof value === 'string') {
    return formatDate(value, { formatter: options?.dateFormatter });
  }
  if (fieldKey === 'openClVersion' && typeof value === 'number') {
    return value.toFixed(1);
  }
  if (fieldKey === 'openGlVersion' && typeof value === 'number') {
    return value.toFixed(1);
  }
  if (fieldKey === 'shaderModelVersion' && typeof value === 'number') {
    return value.toFixed(1);
  }
  if (fieldKey === 'valueScore' && typeof value === 'number') {
    return value.toFixed(2);
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
    case MarketSegmentValue.Mobile:
      return 'Mobile';
    case MarketSegmentValue.Workstation:
      return 'Workstation';
    default:
      throw new Error(`Invalid market segment value: ${value}`);
  }
}
