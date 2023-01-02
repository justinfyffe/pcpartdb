import { Part, PartsQuery } from '@shared/part';
import { createContext } from 'react';

interface ListPageContextState {
  query?: PartsQuery;
  setQuery: (query: PartsQuery) => void;
  gpus: Part[];
}

export const ListPageContext = createContext<ListPageContextState>({
  query: null,
  setQuery: null,
  gpus: null,
});

export function createListPageContextState(input: {
  query: PartsQuery;
  setQuery: (query: PartsQuery) => void;
  gpus: Part[];
}) {
  const query = { ...input.query };
  const setQuery = input.setQuery;
  const gpus = [...input.gpus];

  return { query, setQuery, gpus } as ListPageContextState;
}
