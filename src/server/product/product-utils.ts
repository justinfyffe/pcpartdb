import { compareBenchmarks } from '@shared/benchmark';
import {
  Product,
  ProductsFilter,
  ProductsOrder,
  ProductsOrderBy,
  ProductsSort,
} from '@shared/product';
import { compareSpecs } from '@shared/spec';

export function filterProducts<T extends Product>(
  products: T[],
  filter: ProductsFilter,
): T[] {
  const companyFilters =
    filter?.company?.map((company) => company.toLowerCase()) ?? [];
  const architectureFilters =
    filter?.architecture?.map((architecture) => architecture.toLowerCase()) ??
    [];
  const yearFilters = filter?.year ?? [];

  return products.filter((product) => {
    let result = true;

    const company = product.specs?.company?.value?.toLowerCase();
    const architecture = product.specs?.architecture?.value?.toLowerCase();
    const year = Number(product.specs?.releaseDate?.value?.slice(0, 4));

    if (result && filter?.performanceRated === true) {
      result = product.benchmarks?.performanceScore?.value != null;
    }

    if (result && filter?.valueRated === true) {
      result = product.benchmarks?.valueScore?.value != null;
    }

    if (result && companyFilters.length > 0) {
      result =
        result &&
        companyFilters.some((companyFilter) => companyFilter === company);
    }

    if (result && architectureFilters.length > 0) {
      result =
        result &&
        architectureFilters.some(
          (architectureFilter) => architectureFilter === architecture,
        );
    }

    if (result && yearFilters.length > 0) {
      result = result && yearFilters.some((yearFilter) => yearFilter === year);
    }

    return result;
  });
}

export function sortProducts<T extends Product>(
  products: T[],
  orderBy?: ProductsOrderBy,
): T[] {
  const result = [...products];

  const sort = orderBy?.sort;

  if (sort === ProductsSort.Id) {
    // Default ASC
    const order = orderBy?.order ?? ProductsOrder.Asc;
    result.sort((p1, p2) =>
      order === ProductsOrder.Asc ? p1.id - p2.id : p2.id - p1.id,
    );
  } else if (sort === ProductsSort.Name) {
    // Default ASC
    const order = orderBy?.order ?? ProductsOrder.Asc;
    result.sort((p1, p2) =>
      order === ProductsOrder.Asc
        ? p1.name.localeCompare(p2.name)
        : p2.name.localeCompare(p1.name),
    );
  } else if (sort === ProductsSort.ReleaseDate) {
    // Default DESC
    const order = orderBy?.order ?? ProductsOrder.Desc;
    result.sort((p1, p2) =>
      order === ProductsOrder.Asc
        ? compareSpecs(p1.specs?.releaseDate, p2.specs?.releaseDate)
        : compareSpecs(p2.specs?.releaseDate, p1.specs?.releaseDate),
    );
  } else if (sort === ProductsSort.PerformanceRating) {
    // Default DESC
    const order = orderBy?.order ?? ProductsOrder.Desc;
    result.sort((p1, p2) =>
      order === ProductsOrder.Asc
        ? compareBenchmarks(
            p1.benchmarks?.performanceScore,
            p2.benchmarks?.performanceScore,
          )
        : compareBenchmarks(
            p2.benchmarks?.performanceScore,
            p1.benchmarks?.performanceScore,
          ),
    );
  } else if (sort === ProductsSort.ValueRating) {
    // Default DESC
    const order = orderBy?.order ?? ProductsOrder.Desc;
    result.sort((p1, p2) =>
      order === ProductsOrder.Asc
        ? compareBenchmarks(
            p1.benchmarks?.valueScore,
            p2.benchmarks?.valueScore,
          )
        : compareBenchmarks(
            p2.benchmarks?.valueScore,
            p1.benchmarks?.valueScore,
          ),
    );
  } else {
    // Default sort - performance DESC
    const order = orderBy?.order ?? ProductsOrder.Desc;
    result.sort((p1, p2) =>
      order === ProductsOrder.Asc
        ? compareBenchmarks(
            p1.benchmarks?.performanceScore,
            p2.benchmarks?.performanceScore,
          )
        : compareBenchmarks(
            p2.benchmarks?.performanceScore,
            p1.benchmarks?.performanceScore,
          ),
    );
  }

  return result;
}
