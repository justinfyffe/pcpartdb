import {
  CpuProduct,
  ListCpusAdditionalData,
  ListCpusQuery,
} from '@pcpartdb/shared';
import { useMemo } from 'react';
import { getContentParams } from '../content/getContentParams';
import { getContentTags } from '../content/getContentTags';
import { ListPageContextProps } from '../context/ListPageContext';

export function useListPageContextProps(input: {
  query: ListCpusQuery;
  updateQuery: (query: ListCpusQuery) => void;
  cpus: CpuProduct[];
  totalCpus: number;
  additionalData: ListCpusAdditionalData;
}) {
  return useMemo(() => {
    const query = { ...input.query };
    const updateQuery = input.updateQuery;
    const cpus = [...input.cpus];
    const totalCpus = input.totalCpus;
    const additionalData = input.additionalData;

    const contentTags = getContentTags(query);
    const contentParams = getContentParams(query);

    return {
      query,
      updateQuery,
      cpus,
      totalCpus,
      additionalData,

      contentTags,
      contentParams,
    } as ListPageContextProps;
  }, [
    input.additionalData,
    input.cpus,
    input.query,
    input.totalCpus,
    input.updateQuery,
  ]);
}
