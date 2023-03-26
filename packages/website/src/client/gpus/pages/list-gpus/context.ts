import { Gpu, GpusQuery } from '@pcpartdb/shared';
import { createContext, useMemo } from 'react';

export interface ListPageContextProps {
  query?: GpusQuery;
  updateQuery: (query: GpusQuery) => void;
  gpus: Gpu[];
  totalResults: number;
}

export const ListPageContext = createContext<ListPageContextProps>({
  query: null,
  updateQuery: null,
  gpus: null,
  totalResults: null,
});

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

    return { query, updateQuery, gpus, totalResults } as ListPageContextProps;
  }, [input.gpus, input.query, input.totalResults, input.updateQuery]);
}
