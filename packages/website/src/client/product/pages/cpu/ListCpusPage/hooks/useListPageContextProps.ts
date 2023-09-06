import { Cpu, ListCpusContentData, ListCpusQuery } from '@pcpartdb/shared';
import { useMemo } from 'react';
import { getContentParams } from '../content/getContentParams';
import { getContentTags } from '../content/getContentTags';
import { ListPageContextProps } from '../context/ListPageContext';

export function useListPageContextProps(input: {
  query: ListCpusQuery;
  updateQuery: (query: ListCpusQuery) => void;
  cpus: Cpu[];
  totalCpus: number;
  contentData: ListCpusContentData;
}) {
  return useMemo(() => {
    const query = { ...input.query };
    const updateQuery = input.updateQuery;
    const cpus = [...input.cpus];
    const totalCpus = input.totalCpus;
    const contentData = input.contentData;

    const contentTags = getContentTags(query);
    const contentParams = getContentParams(query);

    return {
      query,
      updateQuery,
      cpus,
      totalCpus,
      contentData,

      contentTags,
      contentParams,
    } as ListPageContextProps;
  }, [
    input.contentData,
    input.cpus,
    input.query,
    input.totalCpus,
    input.updateQuery,
  ]);
}
