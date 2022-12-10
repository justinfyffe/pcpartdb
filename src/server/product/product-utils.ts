import { compareBenchmarks } from '@shared/benchmark';
import { Product, ProductsFilter, ProductsOrderBy } from '@shared/product';
import { compareSpecs } from '@shared/spec';

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
  orderBy: ProductsOrderBy,
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
