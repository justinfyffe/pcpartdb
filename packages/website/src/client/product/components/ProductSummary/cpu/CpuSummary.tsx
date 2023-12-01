import { CpuAdditionalData, CpuProduct } from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { buildContentParams } from '../../../content/params';
import { buildContentTags } from '../../../content/tags';
import { IntroBlurb } from './IntroBlurb';
import { PerformanceBlurb } from './PerformanceBlurb';
import { SpecsBlurb } from './SpecsBlurb';

interface CpuSummaryProps {
  cpu: CpuProduct;
  additionalData: CpuAdditionalData;
}

export const CpuSummary: FunctionComponent<CpuSummaryProps> = (props) => {
  const { cpu, additionalData } = props;

  const tags = buildContentTags(cpu);
  const params = buildContentParams(cpu, additionalData);

  return (
    <section className="mb-0">
      <IntroBlurb tags={tags} params={params} />
      <SpecsBlurb tags={tags} params={params} />
      <PerformanceBlurb tags={tags} params={params} />
    </section>
  );
};
