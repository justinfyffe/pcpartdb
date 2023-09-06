import { Cpu, ViewCpuContentData } from '@pcpartdb/shared';
import {
  ContentParams,
  ContentTags,
} from 'packages/website/src/client/shared/content/types';
import { createContext } from 'react';

export interface ViewPageContextProps {
  cpu: Cpu;
  contentData: ViewCpuContentData;
  contentTags: ContentTags;
  contentParams: ContentParams;
}

export const ViewPageContext = createContext<ViewPageContextProps>({
  cpu: null,
  contentData: null,
  contentTags: null,
  contentParams: null,
});
