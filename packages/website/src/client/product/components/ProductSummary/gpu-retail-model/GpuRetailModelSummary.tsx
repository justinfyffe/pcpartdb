import { GpuAdditionalData, GpuProduct } from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { buildContentParams } from '../../../content/params';
import { buildContentTags } from '../../../content/tags';

interface GpuRetailModelSummaryProps {
  gpu: GpuProduct;
  additionalData: GpuAdditionalData;
}

export const GpuRetailModelSummary: FunctionComponent<
  GpuRetailModelSummaryProps
> = (props) => {
  const { gpu, additionalData } = props;

  const tags = buildContentTags(gpu);
  const params = buildContentParams(gpu, additionalData);

  return <section className="mb-0"></section>;
};
