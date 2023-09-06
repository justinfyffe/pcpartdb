import { CompareGpusContentData, GpuComparison } from '@pcpartdb/shared';
import {
  ContentParams,
  ContentTags,
} from 'packages/website/src/client/shared/content/types';
import { createContext } from 'react';

export interface ComparePageContextProps {
  comparison: GpuComparison;
  contentData: CompareGpusContentData;
  contentTags: ContentTags;
  contentParams: ContentParams;
}

export const ComparePageContext = createContext<ComparePageContextProps>({
  comparison: null,
  contentData: null,
  contentTags: null,
  contentParams: null,
});
