import { CompareCpusContentData, CpuComparison } from '@pcpartdb/shared';
import { useMemo } from 'react';
import { getContentParams, getContentTags } from '../content';
import { ComparePageContextProps } from '../context';

export function useComparePageContextProps(input: {
  comparison: CpuComparison;
  contentData: CompareCpusContentData;
}) {
  return useMemo(() => {
    const comparison: CpuComparison = [...input.comparison];
    const contentData = { ...input.contentData };
    const contentTags = getContentTags(comparison);
    const contentParams = getContentParams(comparison);

    return {
      comparison,
      contentData,
      contentTags,
      contentParams,
    } as ComparePageContextProps;
  }, [input.comparison, input.contentData]);
}
