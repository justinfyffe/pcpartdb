import {
  CpuComparison,
  GpuComparison,
  ProductComparison,
  ProductType,
} from '../product';
import { formatCpuName, formatGpuName } from './formatProductName';

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
