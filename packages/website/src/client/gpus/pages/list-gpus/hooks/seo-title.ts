import { GpuSort } from '@pcpartdb/shared';
import {
  compileContentHook,
  ContentHookParams,
} from 'packages/website/src/client/shared/content';
import { useMemo } from 'react';
import { formatGpuCompany } from '../../../gpu-utils';
import { ListPageContextProps } from '../context';

const useSeoTitleContent = compileContentHook(
  {
    filters: [GpuSort.PerformanceRating],
    deps: ['company'],
    hook: (props: ContentHookParams) =>
      `Best ${props.company} Graphics Cards by Performance`,
  },
  {
    filters: [GpuSort.ValueRating],
    deps: ['company'],
    hook: (props: ContentHookParams) =>
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

  const args = useMemo(() => {
    const filters = {
      [query.orderBy?.sort ?? GpuSort.PerformanceRating]: true,
    };

    const params = {
      company:
        query.filter?.company?.length === 1
          ? formatGpuCompany(query.filter?.company[0])
          : null,
    };

    return { filters, params };
  }, [query.filter?.company, query.orderBy?.sort]);

  return useSeoTitleContent(args);
};
