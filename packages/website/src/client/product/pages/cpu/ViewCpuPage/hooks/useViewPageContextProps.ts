import { Cpu, ViewCpuContentData } from '@pcpartdb/shared';
import { useMemo } from 'react';
import { getContentParams, getContentTags } from '../content';
import { ViewPageContextProps } from '../context';

export function useViewPageContextProps(input: {
  cpu: Cpu;
  contentData: ViewCpuContentData;
}) {
  return useMemo(() => {
    const cpu = { ...input.cpu };
    const contentData = { ...input.contentData };
    const contentTags = getContentTags(cpu, contentData);
    const contentParams = getContentParams(cpu, contentData);

    return {
      cpu,
      contentData,
      contentTags,
      contentParams,
    } as ViewPageContextProps;
  }, [input.contentData, input.cpu]);
}
