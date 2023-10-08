import {
  CompareGpusAdditionalData,
  GpuProductComparison,
} from '@pcpartdb/shared';
import { useMemo } from 'react';
import { getContentParams, getContentTags } from '../content';
import { ComparePageContextProps } from '../context/ComparePageContext';

export function useComparePageContextProps(input: {
  comparison: GpuProductComparison;
  additionalData: CompareGpusAdditionalData;
}) {
  return useMemo(() => {
    const comparison: GpuProductComparison = [...input.comparison];
    const additionalData = { ...input.additionalData };
    const contentTags = getContentTags(comparison);
    const contentParams = getContentParams(comparison);

    return {
      comparison,
      additionalData: additionalData,
      contentTags,
      contentParams,
    } as ComparePageContextProps;
  }, [input.comparison, input.additionalData]);
}
