import {
  CpuProductComparison,
  GpuProductComparison,
  ProductComparison,
  ProductType,
} from '../product';
import { formatProductName } from './formatProductName';

export interface FormatProductComparisonNameOptions {
  company?: boolean;
}

export function formatProductComparisonName(
  comparison: ProductComparison,
  options?: FormatProductComparisonNameOptions,
) {
  const productType = comparison[0]?.productType || comparison[1]?.productType;
  switch (productType) {
    case ProductType.Cpu:
      return formatCpuComparisonName(
        comparison as CpuProductComparison,
        options,
      );
    case ProductType.Gpu:
      return formatGpuComparisonName(
        comparison as GpuProductComparison,
        options,
      );
    default:
      throw new Error(
        'Unsupported product tpye for formatting comparison name.',
      );
  }
}

export function formatCpuComparisonName(
  comparison: CpuProductComparison,
  options?: FormatProductComparisonNameOptions,
) {
  const [cpu1, cpu2] = comparison;
  if (cpu1 == null || cpu2 == null) {
    return null;
  }

  return `${formatProductName(cpu1, options)} vs ${formatProductName(
    cpu2,
    options,
  )}`;
}

export function formatGpuComparisonName(
  comparison: GpuProductComparison,
  options?: FormatProductComparisonNameOptions,
) {
  const [gpu1, gpu2] = comparison;
  if (gpu1 == null || gpu2 == null) {
    return null;
  }

  return `${formatProductName(gpu1, options)} vs ${formatProductName(
    gpu2,
    options,
  )}`;
}
