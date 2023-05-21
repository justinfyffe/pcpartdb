import {
  calculateDisplayGpuFieldValue,
  DateFormat,
  formatDate,
  getUnitFormat,
  Gpu,
  GpuComparison,
  GpuField,
  MarketSegmentValue,
  ProductionStatusValue,
} from '@pcpartdb/shared';
import {
  BooleanFormatter,
  formatBooleanValue,
  formatPrice,
} from '../shared/format';

const BRANDS = ['Radeon', 'GeForce', 'Quadro'];

export interface GetGpuNameOptions {
  brand?: boolean;
  company?: boolean;
}

export function getGpuName(gpu: Gpu, options?: GetGpuNameOptions) {
  if (gpu == null) {
    return null;
  }

  const includeCompany = options?.company ?? true;
  const company = includeCompany ? formatGpuField(gpu.company) : null;

  const includeBrand = options?.brand ?? true;
  const gpuName = includeBrand
    ? gpu.name
    : BRANDS.reduce((acc, brand) => {
        return acc.replace(`${brand}`, '');
      }, gpu.name).trim();

  return company != null ? `${company} ${gpuName}` : gpuName;
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
  const length = formatGpuField(gpu.length);
  const height = formatGpuField(gpu.height);
  const width = formatGpuField(gpu.width);
  const slots = formatGpuField(gpu.slotWidth);

  const dimensions: string[] = [];
  dimensions.push(length != null ? `${length}` : null);
  dimensions.push(width != null ? `${width}` : null);
  if (height != null) {
    dimensions.push(`${height}`);
  } else if (slots != null) {
    dimensions.push(`${slots} (H)`);
  }

  if (options?.allowMissingDimensions === false && dimensions.includes(null)) {
    return null;
  }

  return dimensions.filter((value) => value != null).join(' x ') || null;
}

export interface FormatGpuFieldOptions {
  minDecimals?: number;
  maxDecimals?: number;
  booleanFormatter?: BooleanFormatter;
  dateFormat?: DateFormat;
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
  if (fieldKey === 'productionStatus') {
    return formatProductionStatus(value as ProductionStatusValue);
  }
  if (fieldKey === 'releaseDate' && typeof value === 'string') {
    const format = options?.dateFormat ?? meta?.dateFormat;
    return formatDate(value, { format });
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
  } else if (typeof value === 'number') {
    returnValue = calculateDisplayGpuFieldValue(value, unit).toLocaleString(
      undefined,
      {
        minimumFractionDigits: options?.minDecimals ?? 0,
        maximumFractionDigits: options?.maxDecimals ?? 2,
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

export function formatMarketSegment(value: MarketSegmentValue) {
  switch (value) {
    case MarketSegmentValue.Desktop:
      return 'Desktop';
    case MarketSegmentValue.Mobile:
      return 'Mobile';
    case MarketSegmentValue.Workstation:
      return 'Workstation';
    case MarketSegmentValue.Integrated:
      return 'Integrated';
    default:
      throw new Error(`Invalid market segment value: ${value}`);
  }
}

export function formatProductionStatus(value: ProductionStatusValue) {
  switch (value) {
    case ProductionStatusValue.Unreleased:
      return 'Unreleased';
    case ProductionStatusValue.Active:
      return 'Active';
    case ProductionStatusValue.EndOfLife:
      return 'End-of-life';
    default:
      throw new Error(`Invalid production status value: ${value}`);
  }
}

export function hasGpuFieldValue(field: GpuField) {
  return field?.value != null;
}
