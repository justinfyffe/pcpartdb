import { GpuComparison } from '@shared/gpus';
import { createContext } from 'react';
import { ComparePageContentData } from './types';

interface ComparePageContextState {
  comparison: GpuComparison;
  contentData: ComparePageContentData;
}

export const ComparePageContext = createContext<ComparePageContextState>({
  comparison: null,
  contentData: null,
});

export function createComparePageContextState(input: {
  comparison: GpuComparison;
  contentData: ComparePageContentData;
}) {
  const comparison = [...input.comparison];
  const contentData = { ...input.contentData };

  return { comparison, contentData } as ComparePageContextState;
}
