import { Gpu, ViewGpuContentData } from '@pcpartdb/shared';
import {
  ContentParams,
  ContentTags,
} from 'packages/website/src/client/shared/content/types';
import { createContext } from 'react';

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
