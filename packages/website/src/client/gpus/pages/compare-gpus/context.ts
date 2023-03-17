import { CompareGpusContentData, GpuComparison } from '@pcpartdb/shared';
import { createContext } from 'react';

interface ComparePageContextState {
  comparison: GpuComparison;
  contentData: CompareGpusContentData;
}

export const ComparePageContext = createContext<ComparePageContextState>({
  comparison: null,
  contentData: null,
});

export function createComparePageContextState(input: {
  comparison: GpuComparison;
  contentData: CompareGpusContentData;
}) {
  const comparison = [...input.comparison];
  const contentData = { ...input.contentData };

  return { comparison, contentData } as ComparePageContextState;
}
