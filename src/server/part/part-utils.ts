import { compareBenchmarks } from '@shared/benchmark';
import {
  Part,
  PartOrder,
  PartsFilter,
  PartsOrderBy,
  PartSort,
} from '@shared/part';
import { compareSpecs } from '@shared/spec';

export function filterParts<T extends Part>(
  parts: T[],
  filter: PartsFilter,
): T[] {
  const companyFilters =
    filter?.company?.map((company) => company.toLowerCase()) ?? [];
  const architectureFilters =
    filter?.architecture?.map((architecture) => architecture.toLowerCase()) ??
    [];
  const yearFilters = filter?.year ?? [];

  return parts.filter((part) => {
    let result = true;

    const company = part.specs?.company?.value?.toLowerCase();
    const architecture = part.specs?.architecture?.value?.toLowerCase();
    const year = Number(part.specs?.releaseDate?.value?.slice(0, 4));

    if (result && filter?.performanceRated === true) {
      result = part.benchmarks?.performanceScore?.value != null;
    }

    if (result && filter?.valueRated === true) {
      result = part.benchmarks?.valueScore?.value != null;
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

export function sortParts<T extends Part>(
  parts: T[],
  orderBy?: PartsOrderBy,
): T[] {
  const result = [...parts];

  const sort = orderBy?.sort;

  if (sort === PartSort.Id) {
    // Default ASC
    const order = orderBy?.order ?? PartOrder.Asc;
    result.sort((p1, p2) =>
      order === PartOrder.Asc ? p1.id - p2.id : p2.id - p1.id,
    );
  } else if (sort === PartSort.Name) {
    // Default ASC
    const order = orderBy?.order ?? PartOrder.Asc;
    result.sort((p1, p2) =>
      order === PartOrder.Asc
        ? p1.name.localeCompare(p2.name)
        : p2.name.localeCompare(p1.name),
    );
  } else if (sort === PartSort.ReleaseDate) {
    // Default DESC
    const order = orderBy?.order ?? PartOrder.Desc;
    result.sort((p1, p2) =>
      order === PartOrder.Asc
        ? compareSpecs(p1.specs?.releaseDate, p2.specs?.releaseDate)
        : compareSpecs(p2.specs?.releaseDate, p1.specs?.releaseDate),
    );
  } else if (sort === PartSort.PerformanceRating) {
    // Default DESC
    const order = orderBy?.order ?? PartOrder.Desc;
    result.sort((p1, p2) =>
      order === PartOrder.Asc
        ? compareBenchmarks(
            p1.benchmarks?.performanceScore,
            p2.benchmarks?.performanceScore,
          )
        : compareBenchmarks(
            p2.benchmarks?.performanceScore,
            p1.benchmarks?.performanceScore,
          ),
    );
  } else if (sort === PartSort.ValueRating) {
    // Default DESC
    const order = orderBy?.order ?? PartOrder.Desc;
    result.sort((p1, p2) =>
      order === PartOrder.Asc
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
    const order = orderBy?.order ?? PartOrder.Desc;
    result.sort((p1, p2) =>
      order === PartOrder.Asc
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
