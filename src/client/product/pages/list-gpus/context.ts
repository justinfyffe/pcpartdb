import { Product, ProductsQuery } from '@shared/product';
import { createContext } from 'react';

interface ListPageContextState {
  query?: ProductsQuery;
  setQuery: (query: ProductsQuery) => void;
  gpus: Product[];
}

export const ListPageContext = createContext<ListPageContextState>({
  query: null,
  setQuery: null,
  gpus: null,
});

export function createListPageContextState(input: {
  query: ProductsQuery;
  setQuery: (query: ProductsQuery) => void;
  gpus: Product[];
}) {
  const query = { ...input.query };
  const setQuery = input.setQuery;
  const gpus = [...input.gpus];

  return { query, setQuery, gpus } as ListPageContextState;
}
