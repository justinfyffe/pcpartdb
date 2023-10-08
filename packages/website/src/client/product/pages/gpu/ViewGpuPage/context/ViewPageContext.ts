import { GpuProduct, ViewGpuAdditionalData } from '@pcpartdb/shared';
import {
  ContentParams,
  ContentTags,
} from 'packages/website/src/client/shared/content/types';
import { createContext } from 'react';

export interface ViewPageContextProps {
  gpu: GpuProduct;
  additionalData: ViewGpuAdditionalData;
  contentTags: ContentTags;
  contentParams: ContentParams;
}

export const ViewPageContext = createContext<ViewPageContextProps>({
  gpu: null,
  additionalData: null,
  contentTags: null,
  contentParams: null,
});
