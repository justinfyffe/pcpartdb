import {
  CpuProduct,
  ListCpusAdditionalData,
  ListCpusQuery,
} from '@pcpartdb/shared';
import {
  ContentParams,
  ContentTags,
} from 'packages/website/src/client/shared/content/types';
import { createContext } from 'react';

export interface ListPageContextProps {
  query?: ListCpusQuery;
  updateQuery: (query: ListCpusQuery) => void;
  cpus: CpuProduct[];
  totalCpus: number;
  additionalData: ListCpusAdditionalData;

  contentTags: ContentTags;
  contentParams: ContentParams;
}

export const ListPageContext = createContext<ListPageContextProps>({
  query: null,
  updateQuery: null,
  cpus: null,
  totalCpus: null,
  additionalData: null,

  contentTags: null,
  contentParams: null,
});
