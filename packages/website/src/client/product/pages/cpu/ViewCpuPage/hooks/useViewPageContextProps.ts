import { CpuProduct, ViewCpuContentData } from '@pcpartdb/shared';
import { useMemo } from 'react';
import { getContentParams } from '../content/getContentParams';
import { getContentTags } from '../content/getContentTags';
import { ViewPageContextProps } from '../context/ViewPageContext';

export function useViewPageContextProps(input: {
  cpu: CpuProduct;
  additionalData: ViewCpuContentData;
}) {
  return useMemo(() => {
    const cpu = { ...input.cpu };
    const additionalData = { ...input.additionalData };
    const contentTags = getContentTags(cpu, additionalData);
    const contentParams = getContentParams(cpu, additionalData);

    return {
      cpu,
      additionalData: additionalData,
      contentTags,
      contentParams,
    } as ViewPageContextProps;
  }, [input.additionalData, input.cpu]);
}
