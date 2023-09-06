import { Gpu, ViewGpuContentData } from '@pcpartdb/shared';
import { useMemo } from 'react';
import { getContentParams } from '../content/getContentParams';
import { getContentTags } from '../content/getContentTags';
import { ViewPageContextProps } from '../context/ViewPageContext';

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
