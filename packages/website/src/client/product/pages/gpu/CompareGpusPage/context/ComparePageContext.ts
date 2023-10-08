import {
  CompareGpusAdditionalData,
  GpuProductComparison,
} from '@pcpartdb/shared';
import {
  ContentParams,
  ContentTags,
} from 'packages/website/src/client/shared/content/types';
import { createContext } from 'react';

export interface ComparePageContextProps {
  comparison: GpuProductComparison;
  additionalData: CompareGpusAdditionalData;
  contentTags: ContentTags;
  contentParams: ContentParams;
}

export const ComparePageContext = createContext<ComparePageContextProps>({
  comparison: null,
  additionalData: null,
  contentTags: null,
  contentParams: null,
});
