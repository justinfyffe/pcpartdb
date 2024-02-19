import React, { FunctionComponent } from 'react';
import { CompatibilityBlurb } from './CompatibilityBlurb';
import { IntroBlurb } from './IntroBlurb';
import { MemoryBlurb } from './MemoryBlurb';
import { PerformanceBlurb } from './PerformanceBlurb';
import { PowerSupplyBlurb } from './PowerSupplyBlurb';

interface GpuRetailModelSummaryProps {}

export const GpuRetailModelSummary: FunctionComponent<
  GpuRetailModelSummaryProps
> = (_props) => {
  return (
    <section className="-mb-4">
      <IntroBlurb />
      <PerformanceBlurb />
      <MemoryBlurb />
      <CompatibilityBlurb />
      <PowerSupplyBlurb />
    </section>
  );
};
