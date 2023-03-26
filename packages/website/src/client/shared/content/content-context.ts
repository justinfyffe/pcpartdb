import { createContext } from 'react';
import {
  ContentComponentParams,
  ContentFilters,
  ContentFunctionParams,
} from './content-types';

interface ContentContextState {
  filters?: ContentFilters;
  params?: ContentComponentParams | ContentFunctionParams;
}

export const ContentContext = createContext<ContentContextState>({});
