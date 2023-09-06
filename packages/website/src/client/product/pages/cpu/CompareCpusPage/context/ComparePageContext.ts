import { CompareCpusContentData, CpuComparison } from '@pcpartdb/shared';
import {
  ContentParams,
  ContentTags,
} from 'packages/website/src/client/shared/content/types';
import { createContext } from 'react';

export interface ComparePageContextProps {
  comparison: CpuComparison;
  contentData: CompareCpusContentData;
  contentTags: ContentTags;
  contentParams: ContentParams;
}

export const ComparePageContext = createContext<ComparePageContextProps>({
  comparison: null,
  contentData: null,
  contentTags: null,
  contentParams: null,
});
