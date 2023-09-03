import { getDisplayUnitValue, getUnitFormat } from '../common';
import {
  convertToCpuMemoryChannelText,
  CpuField,
  CpuMarketSegmentValue,
  CpuProductionStatusValue,
  Gpu,
  GpuField,
  GpuMarketSegmentValue,
  GpuProductionStatusValue,
  ProductField,
  ProductType,
} from '../product';
import { BooleanFormatter, formatBooleanValue } from './formatBooleanValue';
import { DateFormat, formatDate } from './formatDate';
import { formatPrice } from './formatPrice';

export interface FormatProductFieldOptions {
  minDecimals?: number;
  maxDecimals?: number;
  booleanFormatter?: BooleanFormatter;
  dateFormat?: DateFormat;
  showUnits?: boolean;
}

export function formatProductField(
  productType: ProductType,
  productField: ProductField,
  options?: FormatProductFieldOptions,
) {
  if (productField == null) {
    return null;
  }

  const { value, meta } = productField;
  if (value == null) {
    return null;
  }

  let formattedValue: string = null;

  // Try handling specialized fields first.
  switch (productType) {
    case ProductType.Cpu:
      formattedValue = formatSpecialCpuField(productField as CpuField, options);
      break;
    case ProductType.Gpu:
      formattedValue = formatSpecialGpuField(productField as GpuField);
      break;
    default:
      throw new Error('Unsupported product type for formatting field.');
  }

  if (formattedValue != null) {
    return formattedValue;
  }

  // Not a specialized field. Format in a generic way based on type.
  // Compute string to return

  let returnValue: string = null;
  const unit = meta?.unit ?? null;
  if (typeof value === 'boolean') {
    returnValue = formatBooleanValue(value, {
      formatter: options?.booleanFormatter,
    });
  } else if (typeof value === 'number') {
    returnValue = getDisplayUnitValue(value, unit).toLocaleString(undefined, {
      minimumFractionDigits: options?.minDecimals ?? 0,
      maximumFractionDigits: options?.maxDecimals ?? 2,
    });
  } else if (typeof value === 'string') {
    returnValue = value;
  } else if (Array.isArray(value)) {
    returnValue = value.join(', ');
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

// CPU

export function formatCpuField(
  field: CpuField,
  options?: FormatProductFieldOptions,
) {
  return formatProductField(ProductType.Cpu, field, options);
}

export function formatSpecialCpuField(
  field: CpuField,
  options?: FormatProductFieldOptions,
) {
  const { value, meta } = field;
  const fieldKey = meta?.fieldKey;
  const unit = meta?.unit ?? null;

  if (fieldKey === 'company' && typeof value === 'string') {
    return formatCpuCompany(value);
  }

  if (fieldKey === 'launchPrice' && typeof value === 'number') {
    return formatPrice(value, { ...options, currency: field.meta?.currency });
  }

  if (fieldKey === 'marketSegments') {
    return formatCpuMarketSegments(value as CpuMarketSegmentValue[]);
  }

  if (fieldKey === 'productionStatus') {
    return formatCpuProductionStatus(value as CpuProductionStatusValue);
  }

  if (fieldKey === 'memoryChannels' && typeof value === 'number') {
    return convertToCpuMemoryChannelText(value);
  }

  if (fieldKey === 'memorySupport' && Array.isArray(value)) {
    return [...value].sort((v1, v2) => v2.localeCompare(v1)).join(', ');
  }

  if (
    (fieldKey === 'clock' ||
      fieldKey === 'turboClock' ||
      fieldKey === 'performanceCoreClock' ||
      fieldKey === 'performanceCoreTurboClock' ||
      fieldKey === 'efficientCoreClock' ||
      fieldKey === 'efficientCoreTurboClock') &&
    typeof value === 'number'
  ) {
    let formattedValue = getDisplayUnitValue(value, unit).toFixed(1);
    if ((options?.showUnits ?? true) && unit != null) {
      formattedValue = `${formattedValue} ${getUnitFormat(unit)}`;
    }
    return formattedValue;
  }

  if (fieldKey === 'multiplier' && typeof value === 'number') {
    return `${value.toFixed(1)}x`;
  }

  if (fieldKey === 'releaseDate' && typeof value === 'string') {
    const format = options?.dateFormat ?? meta?.dateFormat;
    return formatDate(value, { format });
  }

  if (fieldKey === 'valueScore' && typeof value === 'number') {
    return value.toFixed(2);
  }

  // Not a special case.
  return null;
}

export function formatCpuCompany(company: string) {
  if (company == null) {
    return null;
  }

  switch (company.toLowerCase()) {
    case 'amd':
      return 'AMD';
    case 'intel':
      return 'Intel';
    default:
      return company;
  }
}

export function formatCpuMarketSegments(value: CpuMarketSegmentValue[]) {
  return value.map((segment) => formatCpuMarketSegment(segment)).join(', ');
}

export function formatCpuMarketSegment(value: CpuMarketSegmentValue) {
  switch (value) {
    case CpuMarketSegmentValue.Desktop:
      return 'Desktop';
    case CpuMarketSegmentValue.Mobile:
      return 'Mobile';
    case CpuMarketSegmentValue.Workstation:
      return 'Workstation';
    case CpuMarketSegmentValue.Server:
      return 'Server';
    case CpuMarketSegmentValue.Embedded:
      return 'Embedded';
    default:
      throw new Error(`Invalid market segment value: ${value}`);
  }
}

export function formatCpuProductionStatus(value: CpuProductionStatusValue) {
  switch (value) {
    case CpuProductionStatusValue.Unreleased:
      return 'Unreleased';
    case CpuProductionStatusValue.Active:
      return 'Active';
    case CpuProductionStatusValue.EndOfLife:
      return 'End-of-life';
    default:
      throw new Error(`Invalid production status value: ${value}`);
  }
}

// GPU

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
