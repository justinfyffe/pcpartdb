import { GpuComparison } from '@pcpartdb/shared';
import { parse } from 'date-fns';

export enum CompareGpusContentTag {
  SameCompany = 'SAME_COMPANY',
  SameReleaseYear = 'SAME_RELEASE_YEAR',
}

export function getContentTags(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;

  const sameCompany = gpu1.company?.value === gpu2.company?.value;

  const sameReleaseYear = false;
  if (gpu1.releaseDate?.value != null && gpu2.releaseDate?.value != null) {
    const gpu1Year = parse(gpu1.releaseDate.value, 'yyyy-MM-dd', new Date());
    const gpu2Year = parse(gpu2.releaseDate.value, 'yyyy-MM-dd', new Date());
    return gpu1Year.getUTCFullYear() === gpu2Year.getUTCFullYear();
  }

  return {
    [CompareGpusContentTag.SameCompany]: sameCompany,
    [CompareGpusContentTag.SameReleaseYear]: sameReleaseYear,
  };
}
