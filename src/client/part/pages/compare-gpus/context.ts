import { PartComparison } from '@shared/part';
import { createContext } from 'react';
import { ComparePageContentData } from './types';

interface ComparePageContextState {
  comparison: PartComparison;
  contentData: ComparePageContentData;
}

export const ComparePageContext = createContext<ComparePageContextState>({
  comparison: null,
  contentData: null,
});

export function createComparePageContextState(input: {
  comparison: PartComparison;
  contentData: ComparePageContentData;
}) {
  const comparison = [...input.comparison];
  const contentData = { ...input.contentData };

  return { comparison, contentData } as ComparePageContextState;
}
