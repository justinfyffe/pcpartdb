import { Cpu, ViewCpuContentData } from '@pcpartdb/shared';
import { useMemo } from 'react';
import { getContentParams } from '../content/getContentParams';
import { getContentTags } from '../content/getContentTags';
import { ViewPageContextProps } from '../context/ViewPageContext';

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
