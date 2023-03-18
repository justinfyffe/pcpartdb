import { Gpu, GpusQuery } from '@pcpartdb/shared';
import { createContext } from 'react';

interface ListPageContextState {
  query?: GpusQuery;
  updateQuery: (query: GpusQuery) => void;
  gpus: Gpu[];
}

export const ListPageContext = createContext<ListPageContextState>({
  query: null,
  updateQuery: null,
  gpus: null,
});

export function createListPageContextState(input: {
  query: GpusQuery;
  updateQuery: (query: GpusQuery) => void;
  gpus: Gpu[];
}) {
  const query = { ...input.query };
  const updateQuery = input.updateQuery;
  const gpus = [...input.gpus];

  return { query, updateQuery, gpus } as ListPageContextState;
}
