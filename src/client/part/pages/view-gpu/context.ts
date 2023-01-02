import { Part } from '@shared/part';
import { createContext } from 'react';
import { ViewPageContentData } from './types';

interface ViewPageContextState {
  part: Part;
  contentData: ViewPageContentData;
}

export const ViewPageContext = createContext<ViewPageContextState>({
  part: null,
  contentData: null,
});

export function createViewPageContextState(input: {
  part: Part;
  contentData: ViewPageContentData;
}) {
  const part = { ...input.part };
  const contentData = { ...input.contentData };

  return { part, contentData } as ViewPageContextState;
}
