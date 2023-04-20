import React, { FunctionComponent } from 'react';
import { IntroBlurb } from './IntroBlurb';
import { MemoryBlurb } from './MemoryBlurb';
import { PerformanceAndValueBlurb } from './PerformanceAndValueBlurb';

export const Overview: FunctionComponent = () => {
  return (
    <section className="-mb-4">
      <h2>Overview</h2>

      <IntroBlurb />
      <PerformanceAndValueBlurb />
      <MemoryBlurb />
    </section>
  );
};
