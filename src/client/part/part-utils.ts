import { Part, PartComparison } from '@shared/part';

interface GetGpuNameOptions {
  company?: boolean;
}

export function getGpuName(part: Part, options?: GetGpuNameOptions) {
  if (part == null) {
    return null;
  }

  const includeCompany = options?.company ?? true;
  const company = includeCompany ? part.specs?.company?.value ?? null : null;

  return company != null ? `${company} ${part.name}` : part.name;
}

interface GetGpuComparisonNameOptions {
  company?: boolean;
}

export function getGpuComparisonName(
  comparison: PartComparison,
  options?: GetGpuComparisonNameOptions,
) {
  const [part1, part2] = comparison;
  if (part1 == null || part2 == null) {
    return null;
  }

  return `${getGpuName(part1, options)} vs ${getGpuName(part2, options)}`;
}

export function getViewGpuSlug(part: Part) {
  return part.slug;
}

interface GetPartComparisonSlugOptions {
  ordered?: boolean;
}

export function getCompareGpusSlug(
  comparison: PartComparison,
  options?: GetPartComparisonSlugOptions,
) {
  const [part1, part2] =
    options?.ordered === true
      ? [...comparison].sort((p1, p2) => p1.id - p2.id)
      : comparison;
  return `${part1.slug}--vs--${part2.slug}`;
}

export function getShoppingUrl(part: Part) {
  return part.metas?.retailModels?.value?.[0]?.amazonUrl ?? null;
}
