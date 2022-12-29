import { Product, ProductComparison } from '@shared/product';

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

interface GetProductComparisonNameOptions {
  company?: boolean;
}

export function getProductComparisonName(
  comparison: ProductComparison,
  options?: GetProductComparisonNameOptions,
) {
  const [product1, product2] = comparison;
  if (product1 == null || product2 == null) {
    return null;
  }

  return `${getProductName(product1, options)} vs ${getProductName(
    product2,
    options,
  )}`;
}

export function getProductDetailsSlug(product: Product) {
  return product.slug;
}

interface GetProductComparisonSlugOptions {
  ordered?: boolean;
}

export function getProductComparisonSlug(
  comparison: ProductComparison,
  options?: GetProductComparisonSlugOptions,
) {
  const [product1, product2] =
    options?.ordered === true
      ? [...comparison].sort((p1, p2) => p1.id - p2.id)
      : comparison;
  return `${product1.slug}--vs--${product2.slug}`;
}
