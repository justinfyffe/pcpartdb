import { compareBenchmarks } from '../benchmark';
import { compareSpecs } from '../spec';
import {
  Product,
  ProductComparison,
  ProductsFilter,
  ProductsSort,
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

    if (result && filter?.performanceRated === true) {
      result = product.benchmarks?.performanceScore?.value != null;
    }

    if (result && filter?.valueRated === true) {
      result = product.benchmarks?.valueScore?.value != null;
    }

    if (result && filter?.company != null) {
      result =
        filter.company.toLowerCase() ===
        product.specs?.company?.value?.toLowerCase();
    }

    if (result && filter?.architecture != null) {
      result =
        filter.architecture.toLowerCase() ===
        product.specs?.architecture?.value?.toLowerCase();
    }

    if (result && filter?.year != null) {
      result =
        filter.year === Number(product.specs?.releaseDate?.value?.slice(0, 4));
    }

    return result;
  });
}

export function sortProducts<T extends Product>(
  products: T[],
  sort?: ProductsSort,
): T[] {
  const result = [...products];

  if (sort === ProductsSort.Id) {
    // ASC
    result.sort((p1, p2) => p1.id - p2.id);
  } else if (sort === ProductsSort.Name) {
    // ASC
    result.sort((p1, p2) => p1.name.localeCompare(p2.name));
  } else if (sort === ProductsSort.ReleaseDate) {
    // DESC
    result.sort((p1, p2) =>
      compareSpecs(p2.specs?.releaseDate, p1.specs?.releaseDate),
    );
  } else if (sort === ProductsSort.PerformanceRating) {
    // DESC
    result.sort((p1, p2) =>
      compareBenchmarks(
        p2.benchmarks?.performanceScore,
        p1.benchmarks?.performanceScore,
      ),
    );
  } else if (sort === ProductsSort.ValueRating) {
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
