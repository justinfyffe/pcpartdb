import {
  ContentParams,
  ContentTags,
} from 'packages/website/src/client/shared/content/types';
import React, { FunctionComponent } from 'react';
import { CompatibilityBlurb } from './CompatibilityBlurb';
import { IntroBlurb } from './IntroBlurb';
import { MemoryBlurb } from './MemoryBlurb';
import { PerformanceBlurb } from './PerformanceBlurb';
import { PowerSupplyBlurb } from './PowerSupplyBlurb';

interface GpuChipsetSummaryProps {
  tags: ContentTags;
  params: ContentParams;
}

export const GpuChipsetSummary: FunctionComponent<GpuChipsetSummaryProps> = (
  props,
) => {
  const { tags, params } = props;

  return (
    <section className="-mb-4">
      <IntroBlurb tags={tags} params={params} />
      <PerformanceBlurb tags={tags} params={params} />
      <MemoryBlurb tags={tags} params={params} />
      <CompatibilityBlurb tags={tags} params={params} />
      <PowerSupplyBlurb tags={tags} params={params} />
    </section>
  );
};
