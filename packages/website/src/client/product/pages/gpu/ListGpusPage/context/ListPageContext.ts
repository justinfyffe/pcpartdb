import {
  GpuProduct,
  ListGpusAdditionalData,
  ListGpusQuery,
} from '@pcpartdb/shared';
import {
  ContentParams,
  ContentTags,
} from 'packages/website/src/client/shared/content/types';
import { createContext } from 'react';

export interface ListPageContextProps {
  query?: ListGpusQuery;
  updateQuery: (query: ListGpusQuery) => void;
  gpus: GpuProduct[];
  totalGpus: number;
  additionalData: ListGpusAdditionalData;

  contentTags: ContentTags;
  contentParams: ContentParams;
}

export const ListPageContext = createContext<ListPageContextProps>({
  query: null,
  updateQuery: null,
  gpus: null,
  totalGpus: null,
  additionalData: null,

  contentTags: null,
  contentParams: null,
});
