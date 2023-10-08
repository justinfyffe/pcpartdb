import { getDisplayUnitValue, getUnitFormat, MeasurementUnit } from '../common';
import {
  convertToCpuMemoryChannelText,
  CpuFieldKey,
  GpuFieldKey,
  GpuProduct,
  MarketSegment,
  productFieldFormattedValue,
  ProductFieldKey,
  ProductionStatus,
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
  displayUnit?: MeasurementUnit;

  currency?: string;
}

export function formatProductField<T = unknown>(
  productType: ProductType,
  fieldKey: ProductFieldKey,
  rawValue: T,
  options?: FormatProductFieldOptions,
) {
  let formattedValue: string = null;

  switch (productType) {
    case ProductType.Cpu:
      formattedValue = formatSpecialCpuField(
        fieldKey as CpuFieldKey,
        rawValue,
        options,
      );
      break;
    case ProductType.Gpu:
      formattedValue = formatSpecialGpuField(
        fieldKey as GpuFieldKey,
        rawValue,
        options,
      );
      break;
    default:
      throw new Error('Unsupported product type for formatting field value.');
  }

  if (formattedValue != null) {
    return formattedValue;
  }

  // Not a specialized field. Format in a generic way based on type.
  // Compute string to return

  let returnValue: string = null;
  const unit = options?.displayUnit ?? null;
  if (typeof rawValue === 'boolean') {
    returnValue = formatBooleanValue(rawValue, {
      formatter: options?.booleanFormatter,
    });
  } else if (typeof rawValue === 'number') {
    returnValue = getDisplayUnitValue(rawValue, unit).toLocaleString(
      undefined,
      {
        minimumFractionDigits: options?.minDecimals ?? 0,
        maximumFractionDigits: options?.maxDecimals ?? 2,
      },
    );
  } else if (typeof rawValue === 'string') {
    returnValue = rawValue;
  } else if (Array.isArray(rawValue)) {
    returnValue = rawValue.join(', ');
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

export function formatCpuField<T = unknown>(
  fieldKey: CpuFieldKey,
  rawValue: T,
  options?: FormatProductFieldOptions,
) {
  return formatProductField(ProductType.Cpu, fieldKey, rawValue, options);
}

export function formatSpecialCpuField<T = unknown>(
  fieldKey: CpuFieldKey,
  rawValue: T,
  options?: FormatProductFieldOptions,
) {
  const showUnits = options?.showUnits ?? true;
  const unit = options?.displayUnit ?? null;
  const currency = options?.currency ?? null;

  if (fieldKey === 'msrp' && typeof rawValue === 'number') {
    return formatPrice(rawValue, { ...options, currency });
  }

  if (fieldKey === 'marketSegment') {
    return formatMarketSegment(rawValue as MarketSegment);
  }

  if (fieldKey === 'productionStatus') {
    return formatProductionStatus(rawValue as ProductionStatus);
  }

  if (fieldKey === 'memoryChannels' && typeof rawValue === 'number') {
    return convertToCpuMemoryChannelText(rawValue);
  }

  if (
    (fieldKey === 'clock' ||
      fieldKey === 'turboClock' ||
      fieldKey === 'pCoreClock' ||
      fieldKey === 'pCoreTurboClock' ||
      fieldKey === 'eCoreClock' ||
      fieldKey === 'eCoreTurboClock') &&
    typeof rawValue === 'number'
  ) {
    let formattedValue = getDisplayUnitValue(rawValue, unit).toFixed(1);
    if (showUnits && unit != null) {
      formattedValue = `${formattedValue} ${getUnitFormat(unit)}`;
    }
    return formattedValue;
  }

  if (fieldKey === 'multiplier' && typeof rawValue === 'number') {
    return `${rawValue.toFixed(1)}${getUnitFormat(unit)}`;
  }

  if (fieldKey === 'releaseDate' && typeof rawValue === 'string') {
    const format = options?.dateFormat;
    return formatDate(rawValue, { format });
  }

  if (fieldKey === 'performancePerMsrp' && typeof rawValue === 'number') {
    return rawValue.toFixed(2);
  }

  // Not a special case.
  return null;
}

// GPU

export function formatGpuField<T = unknown>(
  fieldKey: GpuFieldKey,
  rawValue: T,
  options?: FormatProductFieldOptions,
) {
  return formatProductField(ProductType.Gpu, fieldKey, rawValue, options);
}

export function formatSpecialGpuField<T = unknown>(
  fieldKey: GpuFieldKey,
  rawValue: T,
  options?: FormatProductFieldOptions,
) {
  const showUnits = options?.showUnits ?? true;
  const currency = options?.currency ?? null;

  if (fieldKey === 'msrp' && typeof rawValue === 'number') {
    return formatPrice(rawValue, { ...options, currency });
  }
  if (fieldKey === 'slotWidth' && typeof rawValue === 'number') {
    if (showUnits === false) {
      return `${rawValue}`;
    }
    return rawValue === 1 ? `${rawValue} slot` : `${rawValue} slots`;
  }
  if (fieldKey === 'marketSegment') {
    return formatMarketSegment(rawValue as MarketSegment);
  }
  if (fieldKey === 'productionStatus') {
    return formatProductionStatus(rawValue as ProductionStatus);
  }
  if (fieldKey === 'releaseDate' && typeof rawValue === 'string') {
    const format = options?.dateFormat;
    return formatDate(rawValue, { format });
  }
  if (fieldKey === 'openClVersion' && typeof rawValue === 'number') {
    return rawValue.toFixed(1);
  }
  if (fieldKey === 'openGlVersion' && typeof rawValue === 'number') {
    return rawValue.toFixed(1);
  }
  if (fieldKey === 'shaderModelVersion' && typeof rawValue === 'number') {
    return rawValue.toFixed(1);
  }
  if (fieldKey === 'performancePerMsrp' && typeof rawValue === 'number') {
    return rawValue.toFixed(2);
  }

  // Not a special case.
  return null;
}

interface FormatGpuDimensionsOptions {
  allowMissingDimensions?: boolean;
}

export function formatGpuDimensions(
  gpu: GpuProduct,
  options?: FormatGpuDimensionsOptions,
) {
  const length = productFieldFormattedValue(gpu.fields?.length);
  const height = productFieldFormattedValue(gpu.fields?.height);
  const width = productFieldFormattedValue(gpu.fields?.width);
  const slots = productFieldFormattedValue(gpu.fields?.slotWidth);

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

export function formatCompanyName(company: string) {
  if (company == null || company.length === 0) {
    return null;
  }

  switch (company.toLowerCase()) {
    case 'acer':
      return 'Acer';
    case 'amd':
      return 'AMD';
    case 'asrock':
      return 'ASRock';
    case 'asus':
      return 'ASUS';
    case 'ati':
      return 'ATI';
    case 'evga':
      return 'EVGA';
    case 'gainward':
      return 'Gainward';
    case 'galax':
      return 'GALAX';
    case 'gigabyte':
      return 'GIGABYTE';
    case 'inno3d':
      return 'INNO3D';
    case 'intel':
      return 'Intel';
    case 'msi':
      return 'MSI';
    case 'nvidia':
      return 'NVIDIA';
    case 'pny':
      return 'PNY';
    case 'powercolor':
      return 'PowerColor';
    case 'sapphire':
      return 'SAPPHIRE';
    case 'xfx':
      return 'XFX';
    case 'zotac':
      return 'ZOTAC';
    default:
      return company;
  }
}

export function formatMarketSegment(segment: MarketSegment) {
  switch (segment) {
    case MarketSegment.Desktop:
      return 'Desktop';
    case MarketSegment.Embedded:
      return 'Embedded';
    case MarketSegment.Integrated:
      return 'Integrated';
    case MarketSegment.Mobile:
      return 'Mobile';
    case MarketSegment.Server:
      return 'Server';
    case MarketSegment.Workstation:
      return 'Workstation';
    default:
      throw new Error(`Invalid market segment value: ${segment}`);
  }
}

export function formatProductionStatus(value: ProductionStatus) {
  switch (value) {
    case ProductionStatus.Active:
      return 'Active';
    case ProductionStatus.EndOfLife:
      return 'End-of-life';
    case ProductionStatus.Unreleased:
      return 'Unreleased';
    default:
      throw new Error(`Invalid production status value: ${value}`);
  }
}
