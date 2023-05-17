import { Gpu, GpusQuery } from '@pcpartdb/shared';
import { useMemo } from 'react';
import { getContentParams, getContentTags } from '../content';
import { ListPageContextProps } from '../context';

export function useListPageContextProps(input: {
  query: GpusQuery;
  updateQuery: (query: GpusQuery) => void;
  gpus: Gpu[];
  totalGpus: number;
}) {
  return useMemo(() => {
    const query = { ...input.query };
    const updateQuery = input.updateQuery;
    const gpus = [...input.gpus];
    const totalGpus = input.totalGpus;

    const contentTags = getContentTags(query);
    const contentParams = getContentParams(query);

    return {
      query,
      updateQuery,
      gpus,
      totalGpus,

      contentTags,
      contentParams,
    } as ListPageContextProps;
  }, [input.gpus, input.query, input.totalGpus, input.updateQuery]);
}
