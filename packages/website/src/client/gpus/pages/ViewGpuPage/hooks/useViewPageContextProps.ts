import { Gpu, ViewGpuContentData } from '@pcpartdb/shared';
import { ViewPageContextProps } from '../context';

export function useViewPageContextProps(input: {
  gpu: Gpu;
  contentData: ViewGpuContentData;
}) {
  const gpu = { ...input.gpu };
  const contentData = { ...input.contentData };

  return { gpu, contentData } as ViewPageContextProps;
}
