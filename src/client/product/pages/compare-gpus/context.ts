import { ProductComparison } from '@shared/product';
import { createContext } from 'react';
import { ComparePageContentData } from './types';

interface ComparePageContextState {
  comparison: ProductComparison;
  contentData: ComparePageContentData;
}

export const ComparePageContext = createContext<ComparePageContextState>({
  comparison: null,
  contentData: null,
});

export function createComparePageContextState(input: {
  comparison: ProductComparison;
  contentData: ComparePageContentData;
}) {
  const comparison = [...input.comparison];
  const contentData = { ...input.contentData };

  return { comparison, contentData } as ComparePageContextState;
}
