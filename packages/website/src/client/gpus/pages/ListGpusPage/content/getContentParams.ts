import { GpusQuery } from '@pcpartdb/shared';
import { formatGpuCompany } from '../../../utils';

export function getContentParams(query: GpusQuery) {
  const company =
    query.filter?.company?.length === 1
      ? formatGpuCompany(query.filter?.company[0])
      : null;

  return { company };
}
