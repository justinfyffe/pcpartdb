import {
  CompareCpusAdditionalData,
  CpuProductComparison,
} from '@pcpartdb/shared';
import { useMemo } from 'react';
import { getContentParams, getContentTags } from '../content';
import { ComparePageContextProps } from '../context/ComparePageContext';

export function useComparePageContextProps(input: {
  comparison: CpuProductComparison;
  additionalData: CompareCpusAdditionalData;
}) {
  return useMemo(() => {
    const comparison: CpuProductComparison = [...input.comparison];
    const additionalData = { ...input.additionalData };
    const contentTags = getContentTags(comparison);
    const contentParams = getContentParams(comparison);

    return {
      comparison,
      additionalData,
      contentTags,
      contentParams,
    } as ComparePageContextProps;
  }, [input.comparison, input.additionalData]);
}
