import { Gpu, ViewGpuContentData } from '@pcpartdb/shared';
import { useMemo } from 'react';
import { getContentParams, getContentTags } from '../content';
import { ViewPageContextProps } from '../context';

export function useViewPageContextProps(input: {
  gpu: Gpu;
  contentData: ViewGpuContentData;
}) {
  return useMemo(() => {
    const gpu = { ...input.gpu };
    const contentData = { ...input.contentData };
    const contentTags = getContentTags(gpu, contentData);
    const contentParams = getContentParams(gpu, contentData);

    return {
      gpu,
      contentData,
      contentTags,
      contentParams,
    } as ViewPageContextProps;
  }, [input.contentData, input.gpu]);
}
