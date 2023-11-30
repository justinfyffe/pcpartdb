import { GpuAdditionalData, GpuProduct } from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { buildContentParams } from '../params';
import { buildContentTags } from '../tags';
import { CompatibilityBlurb } from './CompatibilityBlurb';
import { IntroBlurb } from './IntroBlurb';
import { MemoryBlurb } from './MemoryBlurb';
import { PerformanceBlurb } from './PerformanceBlurb';
import { PowerSupplyBlurb } from './PowerSupplyBlurb';

interface GpuChipsetSummaryProps {
  gpu: GpuProduct;
  additionalData: GpuAdditionalData;
}

export const GpuChipsetSummary: FunctionComponent<GpuChipsetSummaryProps> = (
  props,
) => {
  const { gpu, additionalData } = props;

  const tags = buildContentTags(gpu);
  const params = buildContentParams(gpu, additionalData);

  return (
    <section className="mb-0">
      <IntroBlurb tags={tags} params={params} />
      <PerformanceBlurb tags={tags} params={params} />
      <MemoryBlurb tags={tags} params={params} />
      <CompatibilityBlurb tags={tags} params={params} />
      <PowerSupplyBlurb tags={tags} params={params} />
    </section>
  );
};
