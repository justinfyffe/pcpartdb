import { compareBenchmarks } from '../benchmark';
import { compareSpecs } from '../spec';
import {
  Product,
  ProductComparison,
  ProductsFilter,
  ProductsOrderBy,
} from './product-types';

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

export function getProductDetailsPath(product: Product) {
  return `/gpus/view/${product.slug}`;
}

export function getProductComparisonPath(comparison: ProductComparison) {
  const [product1, product2] = sortProducts(comparison);
  return `/gpus/compare/${product1.slug}--vs--${product2.slug}`;
}

export function filterProducts<T extends Product>(
  products: T[],
  filter: ProductsFilter,
): T[] {
  return products.filter((product) => {
    let result = true;

    if (filter?.company != null) {
      result =
        result &&
        filter.company.toLowerCase() ===
          product.specs?.company?.value?.toLowerCase();
    }

    return result;
  });
}

export function sortProducts<T extends Product>(
  products: T[],
  orderBy?: ProductsOrderBy,
): T[] {
  const result = [...products];

  if (orderBy === ProductsOrderBy.Id) {
    // ASC
    result.sort((p1, p2) => p1.id - p2.id);
  } else if (orderBy === ProductsOrderBy.Name) {
    // ASC
    result.sort((p1, p2) => p1.name.localeCompare(p2.name));
  } else if (orderBy === ProductsOrderBy.ReleaseDate) {
    // DESC
    result.sort((p1, p2) =>
      compareSpecs(p2.specs?.releaseDate, p1.specs?.releaseDate),
    );
  } else if (orderBy === ProductsOrderBy.PerformanceRating) {
    // DESC
    result.sort((p1, p2) =>
      compareBenchmarks(
        p2.benchmarks?.performanceScore,
        p1.benchmarks?.performanceScore,
      ),
    );
  } else if (orderBy === ProductsOrderBy.ValueRating) {
    // DESC
    result.sort((p1, p2) =>
      compareBenchmarks(p2.benchmarks?.valueScore, p1.benchmarks?.valueScore),
    );
  } else {
    // Default sort - performance DESC
    result.sort((p1, p2) =>
      compareBenchmarks(
        p2.benchmarks?.performanceScore,
        p1.benchmarks?.performanceScore,
      ),
    );
  }

  return result;
}

export function limitProducts<T extends Product>(
  products: T[],
  limit: number,
): T[] {
  const result = [...products];

  if (limit != null) {
    result.splice(limit - 1);
  }

  return result;
}
