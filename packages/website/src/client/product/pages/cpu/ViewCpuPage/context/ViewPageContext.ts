import { Cpu, ViewCpuContentData } from '@pcpartdb/shared';
import { createContext } from 'react';
import { ContentParams, ContentTags } from '../../../../../shared/content';

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
