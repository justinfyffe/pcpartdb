'use client';

import React, { createContext } from 'react';
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

export interface ContentProviderProps {
  tags?: ContentTags;
  params?: ContentComponentParams | ContentFunctionParams;
  children: React.ReactNode;
}

export function ContentProvider(props: ContentProviderProps) {
  return (
    <ContentContext.Provider value={{ tags: props.tags, params: props.params }}>
      {props.children}
    </ContentContext.Provider>
  );
}
