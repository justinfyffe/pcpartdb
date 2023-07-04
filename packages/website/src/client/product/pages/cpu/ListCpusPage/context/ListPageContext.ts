import { Cpu, ListCpusContentData, ListCpusQuery } from '@pcpartdb/shared';
import {
  ContentParams,
  ContentTags,
} from 'packages/website/src/client/shared/content';
import { createContext } from 'react';

export interface ListPageContextProps {
  query?: ListCpusQuery;
  updateQuery: (query: ListCpusQuery) => void;
  cpus: Cpu[];
  totalCpus: number;
  contentData: ListCpusContentData;

  contentTags: ContentTags;
  contentParams: ContentParams;
}

export const ListPageContext = createContext<ListPageContextProps>({
  query: null,
  updateQuery: null,
  cpus: null,
  totalCpus: null,
  contentData: null,

  contentTags: null,
  contentParams: null,
});
