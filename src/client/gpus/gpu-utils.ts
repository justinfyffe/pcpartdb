import { Gpu, GpuComparison } from '@shared/gpus';

interface GetGpuNameOptions {
  company?: boolean;
}

export function getGpuName(gpu: Gpu, options?: GetGpuNameOptions) {
  if (gpu == null) {
    return null;
  }

  const includeCompany = options?.company ?? true;
  const company = includeCompany ? gpu.specs?.company?.value ?? null : null;

  return company != null ? `${company} ${gpu.name}` : gpu.name;
}

interface GetGpuComparisonNameOptions {
  company?: boolean;
}

export function getGpuComparisonName(
  comparison: GpuComparison,
  options?: GetGpuComparisonNameOptions,
) {
  const [gpu1, gpu2] = comparison;
  if (gpu1 == null || gpu2 == null) {
    return null;
  }

  return `${getGpuName(gpu1, options)} vs ${getGpuName(gpu2, options)}`;
}

export function getViewGpuSlug(gpu: Gpu) {
  return gpu.slug;
}

interface GetGpuComparisonSlugOptions {
  ordered?: boolean;
}

export function getCompareGpusSlug(
  comparison: GpuComparison,
  options?: GetGpuComparisonSlugOptions,
) {
  const [gpu1, gpu2] =
    options?.ordered === true
      ? [...comparison].sort((p1, p2) => p1.id - p2.id)
      : comparison;
  return `${gpu1.slug}--vs--${gpu2.slug}`;
}

export function getShoppingUrl(gpu: Gpu) {
  return gpu.affiliateUrl ?? null;
}
