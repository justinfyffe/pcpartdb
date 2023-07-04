import { CompareGpusContentData, GpuComparison } from '@pcpartdb/shared';
import { useMemo } from 'react';
import { getContentParams, getContentTags } from '../content';
import { ComparePageContextProps } from '../context';

export function useComparePageContextProps(input: {
  comparison: GpuComparison;
  contentData: CompareGpusContentData;
}) {
  return useMemo(() => {
    const comparison: GpuComparison = [...input.comparison];
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
