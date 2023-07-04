import { Gpu, ViewGpuContentData } from '@pcpartdb/shared';
import { createContext } from 'react';
import { ContentParams, ContentTags } from '../../../../../shared/content';

export interface ViewPageContextProps {
  gpu: Gpu;
  contentData: ViewGpuContentData;
  contentTags: ContentTags;
  contentParams: ContentParams;
}

export const ViewPageContext = createContext<ViewPageContextProps>({
  gpu: null,
  contentData: null,
  contentTags: null,
  contentParams: null,
});
