import { Gpu, ViewGpuContentData } from '@pcpartdb/shared';
import { createContext } from 'react';

interface ViewPageContextState {
  gpu: Gpu;
  contentData: ViewGpuContentData;
}

export const ViewPageContext = createContext<ViewPageContextState>({
  gpu: null,
  contentData: null,
});

export function createViewPageContextState(input: {
  gpu: Gpu;
  contentData: ViewGpuContentData;
}) {
  const gpu = { ...input.gpu };
  const contentData = { ...input.contentData };

  return { gpu, contentData } as ViewPageContextState;
}
