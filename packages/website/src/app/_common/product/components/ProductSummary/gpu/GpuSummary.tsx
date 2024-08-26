import React, { FunctionComponent } from 'react';
import { CompatibilityBlurb } from './CompatibilityBlurb';
import { CoresAndClocksBlurb } from './CoresAndClocksBlurb';
import { IntroBlurb } from './IntroBlurb';
import { MemoryBlurb } from './MemoryBlurb';
import { PerformanceBlurb } from './PerformanceBlurb';

interface GpuSummaryProps {
  index?: number;
}

export const GpuSummary: FunctionComponent<GpuSummaryProps> = (props) => {
  return (
    <section>
      <IntroBlurb index={props.index} />
      <MemoryBlurb index={props.index} />
      <CoresAndClocksBlurb index={props.index} />
      <CompatibilityBlurb index={props.index} />
      <PerformanceBlurb index={props.index} />
    </section>
  );
};
