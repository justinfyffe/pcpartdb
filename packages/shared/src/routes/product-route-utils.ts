import { Product, ProductComparison, ProductType } from '../product';
import { getCompareCpusPath, getViewCpuPath } from './cpu-route-utils';
import { getCompareGpusPath, getViewGpuPath } from './gpu-route-utils';

export interface GetViewProductPathOptions {
  productType?: ProductType;
  slug?: string;

  product?: Product;
}

export function getViewProductPath(options: GetViewProductPathOptions) {
  const productType = options.productType || options.product?.productType;
  if (productType == null) {
    throw new Error('Cannot determine productType for view products path');
  }

  switch (productType) {
    case ProductType.Cpu:
      return getViewCpuPath(options);
    case ProductType.Gpu:
      return getViewGpuPath(options);
    default:
      throw new Error('Unsupported product type for getting view path');
  }
}

export interface GetCompareProductsPathOptions {
  productType?: ProductType;
  slugs?: [string, string];

  comparison?: ProductComparison;
}

export function getCompareProductsPath(options: GetCompareProductsPathOptions) {
  const productType =
    options.productType || options.comparison?.[0].productType;
  if (productType == null) {
    throw new Error('Cannot determine productType for compare products path');
  }

  switch (productType) {
    case ProductType.Cpu:
      return getCompareCpusPath(options);
    case ProductType.Gpu:
      return getCompareGpusPath(options);
    default:
      throw new Error('Unsupported product type for getting compare path');
  }
}
