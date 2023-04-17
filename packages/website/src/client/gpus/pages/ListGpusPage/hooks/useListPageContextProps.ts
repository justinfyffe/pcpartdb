import { Gpu, GpusQuery } from '@pcpartdb/shared';
import { useMemo } from 'react';
import { getContentParams, getContentTags } from '../content';
import { ListPageContextProps } from '../context';

export function useListPageContextProps(input: {
  query: GpusQuery;
  updateQuery: (query: GpusQuery) => void;
  gpus: Gpu[];
  totalResults: number;
}) {
  return useMemo(() => {
    const query = { ...input.query };
    const updateQuery = input.updateQuery;
    const gpus = [...input.gpus];
    const totalResults = input.totalResults;

    const contentTags = getContentTags(query);
    const contentParams = getContentParams(query);

    return {
      query,
      updateQuery,
      gpus,
      totalResults,

      contentTags,
      contentParams,
    } as ListPageContextProps;
  }, [input.gpus, input.query, input.totalResults, input.updateQuery]);
}
