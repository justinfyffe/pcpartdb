import React, { FunctionComponent } from 'react';
import { CompatibilityBlurb } from './CompatibilityBlurb';
import { IntroBlurb } from './IntroBlurb';
import { MemoryBlurb } from './MemoryBlurb';
import { PerformanceAndValueBlurb } from './PerformanceAndValueBlurb';
import { PowerSupplyBlurb } from './PowerSupplyBlurb';

export const Overview: FunctionComponent = () => {
  return (
    <section className="-mb-4">
      <h2>Overview</h2>

      <IntroBlurb />
      <PerformanceAndValueBlurb />
      <MemoryBlurb />
      <CompatibilityBlurb />
      <PowerSupplyBlurb />
    </section>
  );
};
