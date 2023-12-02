import {
  ContentParams,
  ContentTags,
} from 'packages/website/src/client/shared/content/types';
import React, { FunctionComponent } from 'react';
import { IntroBlurb } from './IntroBlurb';
import { PerformanceBlurb } from './PerformanceBlurb';
import { SpecsBlurb } from './SpecsBlurb';

interface CpuSummaryProps {
  tags: ContentTags;
  params: ContentParams;
}

export const CpuSummary: FunctionComponent<CpuSummaryProps> = (props) => {
  const { tags, params } = props;

  return (
    <section className="mb-0">
      <IntroBlurb tags={tags} params={params} />
      <SpecsBlurb tags={tags} params={params} />
      <PerformanceBlurb tags={tags} params={params} />
    </section>
  );
};
