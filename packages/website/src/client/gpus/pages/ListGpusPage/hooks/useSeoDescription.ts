import { GpuSort } from '@pcpartdb/shared';
import {
  compileContentFunction,
  ContentFunctionParams,
} from 'packages/website/src/client/shared/content';
import { useMemo } from 'react';
import { formatGpuCompany } from '../../../gpu-utils';
import { ListPageContextProps } from '../context';

const seoDescription = compileContentFunction(
  {
    filters: [GpuSort.PerformanceRating],
    deps: ['company'],
    hook: (props: ContentFunctionParams) =>
      `View a list of the best ${props.company} graphics cards by performance. ` +
      'Our database of graphics cards will help you choose the best GPU for your computer.',
  },
  {
    filters: [GpuSort.ValueRating],
    deps: ['company'],
    hook: (props: ContentFunctionParams) =>
      `View a list of the best ${props.company} graphics cards by value. ` +
      'Our database of graphics cards will help you choose the best GPU for your computer.',
  },
  {
    filters: [GpuSort.PerformanceRating],
    hook: () =>
      'View a list of the best graphics cards by performance. ' +
      'Our database of graphics cards will help you choose the best GPU for your computer.',
  },
  {
    filters: [GpuSort.ValueRating],
    hook: () =>
      'View a list of the best graphics cards by value. ' +
      'Our database of graphics cards will help you choose the best GPU for your computer.',
  },
);

export const useSeoDescription = (context: ListPageContextProps) => {
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

    return seoDescription({ filters, params });
  }, [query.filter?.company, query.orderBy?.sort]);
};
