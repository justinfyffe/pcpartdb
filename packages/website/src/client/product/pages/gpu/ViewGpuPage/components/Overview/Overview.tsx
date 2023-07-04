import React, { FunctionComponent } from 'react';
import { CompatibilityBlurb } from './CompatibilityBlurb';
import { IntroBlurb } from './IntroBlurb';
import { MemoryBlurb } from './MemoryBlurb';
import { PerformanceBlurb } from './PerformanceBlurb';
import { PowerSupplyBlurb } from './PowerSupplyBlurb';

export const Overview: FunctionComponent = () => {
  return (
    <section className="-mb-4">
      <h2 className="font-semibold">Overview</h2>

      <IntroBlurb />
      <PerformanceBlurb />
      <MemoryBlurb />
      <CompatibilityBlurb />
      <PowerSupplyBlurb />
    </section>
  );
};
