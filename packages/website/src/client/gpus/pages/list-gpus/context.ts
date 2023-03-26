import { Gpu, GpusQuery } from '@pcpartdb/shared';
import { createContext, useMemo } from 'react';

export interface ListPageContextProps {
  query?: GpusQuery;
  updateQuery: (query: GpusQuery) => void;
  gpus: Gpu[];
}

export const ListPageContext = createContext<ListPageContextProps>({
  query: null,
  updateQuery: null,
  gpus: null,
});

export function useListPageContextProps(input: {
  query: GpusQuery;
  updateQuery: (query: GpusQuery) => void;
  gpus: Gpu[];
}) {
  return useMemo(() => {
    const query = { ...input.query };
    const updateQuery = input.updateQuery;
    const gpus = [...input.gpus];

    return { query, updateQuery, gpus } as ListPageContextProps;
  }, [input.gpus, input.query, input.updateQuery]);
}
