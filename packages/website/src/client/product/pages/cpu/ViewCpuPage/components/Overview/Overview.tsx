import React, { FunctionComponent } from 'react';
import { IntroBlurb } from './IntroBlurb';
import { PerformanceBlurb } from './PerformanceBlurb';
import { SpecsBlurb } from './SpecsBlurb';

export const Overview: FunctionComponent = () => {
  return (
    <section className="-mb-4">
      <h2 className="font-semibold">Overview</h2>

      <IntroBlurb />
      <SpecsBlurb />
      <PerformanceBlurb />
    </section>
  );
};
