import { createContext } from 'react';
import { ContentKeys, ContentParams } from './types';

interface ContentContextState {
  keys?: ContentKeys;
  params?: ContentParams;
}

export const ContentContext = createContext<ContentContextState>({});
