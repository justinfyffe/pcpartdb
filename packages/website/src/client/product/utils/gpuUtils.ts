import {
  formatDate,
  Gpu,
  GpuComparison,
  GpuField,
  GpuMarketSegmentValue,
  GpuProductionStatusValue,
  ProductType,
} from '@pcpartdb/shared';
import { formatPrice } from '../../shared/format';
import {
  FormatProductComparisonNameOptions,
  formatProductField,
  FormatProductFieldOptions,
  FormatProductNameOptions,
} from '..';

const BRANDS = ['Radeon', 'GeForce', 'Quadro'];

export function formatGpuName(gpu: Gpu, options?: FormatProductNameOptions) {
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

export function formatGpuComparisonName(
  comparison: GpuComparison,
  options?: FormatProductComparisonNameOptions,
) {
  const [gpu1, gpu2] = comparison;
  if (gpu1 == null || gpu2 == null) {
    return null;
  }

  return `${formatGpuName(gpu1, options)} vs ${formatGpuName(gpu2, options)}`;
}

export function formatGpuCompany(company: string) {
  if (company == null) {
    return null;
  }

  switch (company.toLowerCase()) {
    case 'amd':
      return 'AMD';
    case 'ati':
      return 'ATI';
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

export function formatGpuField(
  field: GpuField,
  options?: FormatProductFieldOptions,
) {
  return formatProductField(ProductType.Gpu, field, options);
}

export function formatSpecialGpuField(
  field: GpuField,
  options?: FormatProductFieldOptions,
) {
  const { value, meta } = field;
  const fieldKey = meta?.fieldKey;

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
    return formatGpuMarketSegment(value as GpuMarketSegmentValue);
  }
  if (fieldKey === 'productionStatus') {
    return formatGpuProductionStatus(value as GpuProductionStatusValue);
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

  // Not a special case.
  return null;
}

export function formatGpuMarketSegment(value: GpuMarketSegmentValue) {
  switch (value) {
    case GpuMarketSegmentValue.Desktop:
      return 'Desktop';
    case GpuMarketSegmentValue.Mobile:
      return 'Mobile';
    case GpuMarketSegmentValue.Workstation:
      return 'Workstation';
    case GpuMarketSegmentValue.Integrated:
      return 'Integrated';
    default:
      throw new Error(`Invalid market segment value: ${value}`);
  }
}

export function formatGpuProductionStatus(value: GpuProductionStatusValue) {
  switch (value) {
    case GpuProductionStatusValue.Unreleased:
      return 'Unreleased';
    case GpuProductionStatusValue.Active:
      return 'Active';
    case GpuProductionStatusValue.EndOfLife:
      return 'End-of-life';
    default:
      throw new Error(`Invalid production status value: ${value}`);
  }
}

export function getGpuShoppingUrl(gpu: Gpu) {
  return gpu.affiliateUrl ?? null;
}
