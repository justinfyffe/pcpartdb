import { CpuAdditionalData, CpuProduct } from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { buildContentParams } from '../params';
import { buildContentTags } from '../tags';

interface CpuSummaryProps {
  cpu: CpuProduct;
  additionalData: CpuAdditionalData;
}

export const CpuSummary: FunctionComponent<CpuSummaryProps> = (props) => {
  const { cpu, additionalData } = props;

  const tags = buildContentTags(cpu);
  const params = buildContentParams(cpu, additionalData);

  return <section className="mb-0"></section>;
};
