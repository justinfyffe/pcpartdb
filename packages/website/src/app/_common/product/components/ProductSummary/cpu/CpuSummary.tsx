import React, { FunctionComponent } from 'react';
import { IntroBlurb } from './IntroBlurb';
import { PerformanceBlurb } from './PerformanceBlurb';
import { SpecsBlurb } from './SpecsBlurb';

interface CpuSummaryProps {}

export const CpuSummary: FunctionComponent<CpuSummaryProps> = (_props) => {
  return (
    <section className="-mb-4">
      <IntroBlurb />
      <SpecsBlurb />
      <PerformanceBlurb />
    </section>
  );
};
