import {
  Cpu,
  CpuComparison,
  CpuField,
  DateFormat,
  getDisplayUnitValue,
  getUnitFormat,
  Gpu,
  GpuComparison,
  GpuField,
  Product,
  ProductComparison,
  ProductField,
  ProductType,
} from '@pcpartdb/shared';
import { BooleanFormatter, formatBooleanValue } from '../../shared/format';
import {
  formatCpuComparisonName,
  formatCpuName,
  formatSpecialCpuField,
} from './cpuUtils';
import {
  formatGpuComparisonName,
  formatGpuName,
  formatSpecialGpuField,
} from './gpuUtils';

export interface FormatProductNameOptions {
  brand?: boolean;
  company?: boolean;
}

export function formatProductName(
  productType: ProductType,
  product: Product,
  options?: FormatProductNameOptions,
) {
  switch (productType) {
    case ProductType.Cpu:
      return formatCpuName(product as Cpu, options);
    case ProductType.Gpu:
      return formatGpuName(product as Gpu, options);
    default:
      throw new Error('Unsupported product tpye for formatting name.');
  }
}

export interface FormatProductComparisonNameOptions {
  company?: boolean;
}

export function formatProductComparisonName(
  productType: ProductType,
  comparison: ProductComparison,
  options?: FormatProductComparisonNameOptions,
) {
  switch (productType) {
    case ProductType.Cpu:
      return formatCpuComparisonName(comparison as CpuComparison, options);
    case ProductType.Gpu:
      return formatGpuComparisonName(comparison as GpuComparison, options);
    default:
      throw new Error(
        'Unsupported product tpye for formatting comparison name.',
      );
  }
}

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
