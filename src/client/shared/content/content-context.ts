import { createContext } from 'react';
import { ContentFilters, ContentParams } from './content-types';

interface ContentContextState {
  filters?: ContentFilters;
  params?: ContentParams;
}

export const ContentContext = createContext<ContentContextState>({});
