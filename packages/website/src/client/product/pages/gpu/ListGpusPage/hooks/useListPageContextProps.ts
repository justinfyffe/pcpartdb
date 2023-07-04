import { Gpu, ListGpusContentData, ListGpusQuery } from '@pcpartdb/shared';
import { useMemo } from 'react';
import { getContentParams, getContentTags } from '../content';
import { ListPageContextProps } from '../context';

export function useListPageContextProps(input: {
  query: ListGpusQuery;
  updateQuery: (query: ListGpusQuery) => void;
  gpus: Gpu[];
  totalGpus: number;
  contentData: ListGpusContentData;
}) {
  return useMemo(() => {
    const query = { ...input.query };
    const updateQuery = input.updateQuery;
    const gpus = [...input.gpus];
    const totalGpus = input.totalGpus;
    const contentData = input.contentData;

    const contentTags = getContentTags(query);
    const contentParams = getContentParams(query);

    return {
      query,
      updateQuery,
      gpus,
      totalGpus,
      contentData,

      contentTags,
      contentParams,
    } as ListPageContextProps;
  }, [input.gpus, input.query, input.totalGpus, input.updateQuery]);
}
