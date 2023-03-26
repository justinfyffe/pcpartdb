import { Gpu, GpusQuery } from '@pcpartdb/shared';
import { createContext } from 'react';

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
