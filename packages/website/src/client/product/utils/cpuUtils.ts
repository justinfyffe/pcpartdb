import {
  convertToCpuMemoryChannelText,
  Cpu,
  CpuComparison,
  CpuField,
  CpuMarketSegmentValue,
  CpuProductionStatusValue,
  formatDate,
  getDisplayUnitValue,
  getUnitFormat,
  ProductType,
} from '@pcpartdb/shared';
import { formatPrice } from '../../shared/format';
import {
  FormatProductComparisonNameOptions,
  formatProductField,
  FormatProductFieldOptions,
  FormatProductNameOptions,
} from '..';

const BRANDS: string[] = [];

export function formatCpuName(cpu: Cpu, options?: FormatProductNameOptions) {
  if (cpu == null) {
    return null;
  }

  const includeCompany = options?.company ?? true;
  const company = includeCompany ? formatCpuField(cpu.company) : null;

  const includeBrand = options?.brand ?? true;
  const cpuName = includeBrand
    ? cpu.name
    : BRANDS.reduce((acc, brand) => {
        return acc.replace(`${brand}`, '');
      }, cpu.name).trim();

  return company != null ? `${company} ${cpuName}` : cpuName;
}

export function formatCpuComparisonName(
  comparison: CpuComparison,
  options?: FormatProductComparisonNameOptions,
) {
  const [cpu1, cpu2] = comparison;
  if (cpu1 == null || cpu2 == null) {
    return null;
  }

  return `${formatCpuName(cpu1, options)} vs ${formatCpuName(cpu2, options)}`;
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

export function getCpuShoppingUrl(cpu: Cpu) {
  return cpu.affiliateUrl ?? null;
}
