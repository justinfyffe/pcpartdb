import { Gpu, GpusQuery, ListGpusContentData } from '@pcpartdb/shared';
import {
  ContentParams,
  ContentTags,
} from 'packages/website/src/client/shared/content';
import { createContext } from 'react';

export interface ListPageContextProps {
  query?: GpusQuery;
  updateQuery: (query: GpusQuery) => void;
  gpus: Gpu[];
  totalGpus: number;
  contentData: ListGpusContentData;

  contentTags: ContentTags;
  contentParams: ContentParams;
}

export const ListPageContext = createContext<ListPageContextProps>({
  query: null,
  updateQuery: null,
  gpus: null,
  totalGpus: null,
  contentData: null,

  contentTags: null,
  contentParams: null,
});
