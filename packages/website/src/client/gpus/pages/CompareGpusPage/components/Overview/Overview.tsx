import React, { FunctionComponent } from 'react';
import { IntroBlurb } from './IntroBlurb';
import { PerformanceBlurb } from './PerformanceBlurb';

export const Overview: FunctionComponent = () => {
  return (
    <section className="-mb-4">
      <h2>Overview</h2>

      <IntroBlurb />
      <PerformanceBlurb />
      {/* <ValueBlurb /> */}
    </section>
  );
};
