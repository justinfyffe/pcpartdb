import { GpuSort } from '@pcpartdb/shared';
import {
  compileContentFunction,
  ContentFunctionParams,
} from 'packages/website/src/client/shared/content';
import { useMemo } from 'react';
import { formatGpuCompany } from '../../../utils';
import { ListPageContextProps } from '../context';

const seoTitle = compileContentFunction(
  {
    filters: [GpuSort.PerformanceRating],
    deps: ['company'],
    hook: (props: ContentFunctionParams) =>
      `Best ${props.company} Graphics Cards by Performance`,
  },
  {
    filters: [GpuSort.ValueRating],
    deps: ['company'],
    hook: (props: ContentFunctionParams) =>
      `Best ${props.company} Graphics Cards by Value`,
  },
  {
    filters: [GpuSort.PerformanceRating],
    hook: () => 'Best Graphics Cards by Performance',
  },
  {
    filters: [GpuSort.ValueRating],
    hook: () => 'Best Graphics Cards by Value',
  },
);

export const useSeoTitle = (context: ListPageContextProps) => {
  const { query } = context;

  return useMemo(() => {
    const filters = {
      [query.orderBy?.sort ?? GpuSort.PerformanceRating]: true,
    };

    const params = {
      company:
        query.filter?.company?.length === 1
          ? formatGpuCompany(query.filter?.company[0])
          : null,
    };

    return seoTitle({ filters, params });
  }, [query.filter?.company, query.orderBy?.sort]);
};
