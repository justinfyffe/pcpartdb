import { Gpu, ListGpusContentData, ListGpusQuery } from '@pcpartdb/shared';
import { useMemo } from 'react';
import { getContentParams } from '../content/getContentParams';
import { getContentTags } from '../content/getContentTags';
import { ListPageContextProps } from '../context/ListPageContext';

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
  }, [
    input.contentData,
    input.gpus,
    input.query,
    input.totalGpus,
    input.updateQuery,
  ]);
}
