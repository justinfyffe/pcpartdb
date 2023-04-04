import { createContext } from 'react';
import {
  ContentComponentParams,
  ContentFunctionParams,
  ContentTags,
} from './types';

interface ContentContextState {
  tags?: ContentTags;
  params?: ContentComponentParams | ContentFunctionParams;
}

export const ContentContext = createContext<ContentContextState>({});
