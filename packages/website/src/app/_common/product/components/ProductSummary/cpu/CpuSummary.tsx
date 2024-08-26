import { CpuProduct } from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import { CoresAndClocksBlurb } from './CoresAndClocksBlurb';
import { GraphicsBlurb } from './GraphicsBlurb';
import { IntroBlurb } from './IntroBlurb';
import { MemoryAndCacheBlurb } from './MemoryAndCacheBlurb';
import { PerformanceBlurb } from './PerformanceBlurb';

interface CpuSummaryProps {
  index?: number;
}

export const CpuSummary: FunctionComponent<CpuSummaryProps> = (props) => {
  return (
    <section>
      <IntroBlurb index={props.index} />
      <MemoryAndCacheBlurb index={props.index} />
      <CoresAndClocksBlurb index={props.index} />
      <GraphicsBlurb index={props.index} />
      <PerformanceBlurb index={props.index} />
    </section>
  );
};
