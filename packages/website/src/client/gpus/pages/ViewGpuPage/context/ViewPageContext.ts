import { Gpu, ViewGpuContentData } from '@pcpartdb/shared';
import { createContext } from 'react';

export interface ViewPageContextProps {
  gpu: Gpu;
  contentData: ViewGpuContentData;
}

export const ViewPageContext = createContext<ViewPageContextProps>({
  gpu: null,
  contentData: null,
});
