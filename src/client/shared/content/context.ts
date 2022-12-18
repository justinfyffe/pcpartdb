import { createContext } from 'react';
import { ContentHints, ContentParams } from './types';

interface ContentContextState {
  hints?: ContentHints;
  params?: ContentParams;
}

export const ContentContext = createContext<ContentContextState>({});
