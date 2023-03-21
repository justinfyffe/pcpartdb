import { Gpu, ViewGpuContentData } from '@pcpartdb/shared';
import { useMemo } from 'react';
import { ViewPageContextProps } from '../context';

export function useViewPageContextProps(input: {
  gpu: Gpu;
  contentData: ViewGpuContentData;
}) {
  return useMemo(() => {
    const gpu = { ...input.gpu };
    const contentData = { ...input.contentData };

    return { gpu, contentData } as ViewPageContextProps;
  }, [input.contentData, input.gpu]);
}
