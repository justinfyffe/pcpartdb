import { createContext } from 'react';
import {
  ContentComponentParams,
  ContentFilters,
  ContentHookParams,
} from './content-types';

interface ContentContextState {
  filters?: ContentFilters;
  params?: ContentComponentParams | ContentHookParams;
}

export const ContentContext = createContext<ContentContextState>({});
