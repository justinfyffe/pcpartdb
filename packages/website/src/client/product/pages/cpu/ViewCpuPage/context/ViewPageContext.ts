import { CpuProduct, ViewCpuContentData } from '@pcpartdb/shared';
import {
  ContentParams,
  ContentTags,
} from 'packages/website/src/client/shared/content/types';
import { createContext } from 'react';

export interface ViewPageContextProps {
  cpu: CpuProduct;
  additionalData: ViewCpuContentData;
  contentTags: ContentTags;
  contentParams: ContentParams;
}

export const ViewPageContext = createContext<ViewPageContextProps>({
  cpu: null,
  additionalData: null,
  contentTags: null,
  contentParams: null,
});
