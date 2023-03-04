import { Gpu } from '@pcpartdb/shared';
import { createContext } from 'react';
import { ViewPageContentData } from './types';

interface ViewPageContextState {
  gpu: Gpu;
  contentData: ViewPageContentData;
}

export const ViewPageContext = createContext<ViewPageContextState>({
  gpu: null,
  contentData: null,
});

export function createViewPageContextState(input: {
  gpu: Gpu;
  contentData: ViewPageContentData;
}) {
  const gpu = { ...input.gpu };
  const contentData = { ...input.contentData };

  return { gpu, contentData } as ViewPageContextState;
}
