import { Product, ProductComparison } from '@shared/product';

interface GetProductNameOptions {
  company?: boolean;
}

export function getGpuName(product: Product, options?: GetProductNameOptions) {
  if (product == null) {
    return null;
  }

  const includeCompany = options?.company ?? true;
  const company = includeCompany ? product.specs?.company?.value ?? null : null;

  return company != null ? `${company} ${product.name}` : product.name;
}

interface GetGpuComparisonNameOptions {
  company?: boolean;
}

export function getGpuComparisonName(
  comparison: ProductComparison,
  options?: GetGpuComparisonNameOptions,
) {
  const [product1, product2] = comparison;
  if (product1 == null || product2 == null) {
    return null;
  }

  return `${getGpuName(product1, options)} vs ${getGpuName(product2, options)}`;
}

export function getViewGpuSlug(product: Product) {
  return product.slug;
}

interface GetProductComparisonSlugOptions {
  ordered?: boolean;
}

export function getCompareGpusSlug(
  comparison: ProductComparison,
  options?: GetProductComparisonSlugOptions,
) {
  const [product1, product2] =
    options?.ordered === true
      ? [...comparison].sort((p1, p2) => p1.id - p2.id)
      : comparison;
  return `${product1.slug}--vs--${product2.slug}`;
}
