import { Product } from './product-types';

interface GetProductNameOptions {
  company?: boolean;
}

export function getProductName(
  product: Product,
  options?: GetProductNameOptions,
) {
  if (product == null) {
    return null;
  }

  const includeCompany = options?.company ?? true;

  const company = includeCompany ? product.specs?.company?.value ?? null : null;

  return company != null ? `${company} ${product.name}` : product.name;
}

export function getProductDetailsPath(product: Product) {
  return `/gpus/view/${product.slug}`;
}

export function getProductComparisonPath(product1: Product, product2: Product) {
  return `/gpus/compare/${product1.slug}--vs--${product2.slug}`;
}
