import React, { FunctionComponent } from 'react';
import { IntroSummary } from './IntroSummary';

export const Overview: FunctionComponent = () => {
  return (
    <section className="-mb-4">
      <h2>Overview</h2>
      <IntroSummary />
    </section>
  );
};
