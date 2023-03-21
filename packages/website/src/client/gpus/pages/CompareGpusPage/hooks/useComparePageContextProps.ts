import { CompareGpusContentData, GpuComparison } from '@pcpartdb/shared';
import { useMemo } from 'react';
import { ComparePageContextProps } from '../context';

export function useComparePageContextProps(input: {
  comparison: GpuComparison;
  contentData: CompareGpusContentData;
}) {
  return useMemo(() => {
    const comparison = [...input.comparison];
    const contentData = { ...input.contentData };

    return { comparison, contentData } as ComparePageContextProps;
  }, [input.comparison, input.contentData]);
}
