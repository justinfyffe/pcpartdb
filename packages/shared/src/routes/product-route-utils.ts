import {
  Cpu,
  CpuComparison,
  Gpu,
  GpuComparison,
  Product,
  ProductComparison,
  ProductType,
} from '../product';
import { getCompareCpusPath, getViewCpuPath } from './cpu-route-utils';
import { getCompareGpusPath, getViewGpuPath } from './gpu-route-utils';

export function getViewProductPath(
  productType: ProductType,
  productOrSlug: Product | string,
) {
  switch (productType) {
    case ProductType.Cpu:
      return getViewCpuPath(productOrSlug as Cpu | string);
    case ProductType.Gpu:
      return getViewGpuPath(productOrSlug as Gpu | string);
    default:
      throw new Error('Unsupported product type for getting view path.');
  }
}

export interface GetCompareProductsPathOptions {
  ordered?: boolean;
}

export function getCompareProductsPath(
  productType: ProductType,
  comparisonOrSlug: ProductComparison | [string, string],
  options?: GetCompareProductsPathOptions,
) {
  switch (productType) {
    case ProductType.Cpu:
      return getCompareCpusPath(
        comparisonOrSlug as CpuComparison | [string, string],
        options,
      );
    case ProductType.Gpu:
      return getCompareGpusPath(
        comparisonOrSlug as GpuComparison | [string, string],
        options,
      );
    default:
      throw new Error('Unsupported product type for getting view path.');
  }
}
