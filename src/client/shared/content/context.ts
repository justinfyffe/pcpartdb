import { createContext } from 'react';
import { ContentFilters, ContentParams } from './types';

interface ContentContextState {
  hints?: ContentFilters;
  params?: ContentParams;
}

export const ContentContext = createContext<ContentContextState>({});
