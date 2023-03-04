import { Gpu, GpusQuery } from '@pcpartdb/shared/gpus';
import { createContext } from 'react';

interface ListPageContextState {
  query?: GpusQuery;
  setQuery: (query: GpusQuery) => void;
  gpus: Gpu[];
}

export const ListPageContext = createContext<ListPageContextState>({
  query: null,
  setQuery: null,
  gpus: null,
});

export function createListPageContextState(input: {
  query: GpusQuery;
  setQuery: (query: GpusQuery) => void;
  gpus: Gpu[];
}) {
  const query = { ...input.query };
  const setQuery = input.setQuery;
  const gpus = [...input.gpus];

  return { query, setQuery, gpus } as ListPageContextState;
}
