import { GpuProduct, ViewGpuAdditionalData } from '@pcpartdb/shared';
import { useMemo } from 'react';
import { getContentParams } from '../content/getContentParams';
import { getContentTags } from '../content/getContentTags';
import { ViewPageContextProps } from '../context/ViewPageContext';

export function useViewPageContextProps(input: {
  gpu: GpuProduct;
  additionalData: ViewGpuAdditionalData;
}) {
  return useMemo(() => {
    const gpu = { ...input.gpu };
    const additionalData = { ...input.additionalData };
    const contentTags = getContentTags(gpu, additionalData);
    const contentParams = getContentParams(gpu, additionalData);

    return {
      gpu,
      additionalData,
      contentTags,
      contentParams,
    } as ViewPageContextProps;
  }, [input.additionalData, input.gpu]);
}
