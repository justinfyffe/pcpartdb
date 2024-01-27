import { ProductType } from '../product';

const SINGULAR_NAMES: Record<ProductType, string> = {
  [ProductType.Cpu]: 'CPU',
  [ProductType.Gpu]: 'GPU',
};

export interface FormatProductTypeOptions {}

export function formatProductType(
  productType: ProductType,
  options?: FormatProductTypeOptions,
) {
  if (productType == null) {
    return null;
  }

  return SINGULAR_NAMES[productType] || null;
}
