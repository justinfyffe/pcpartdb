import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../context';
import { DimensionsBlurb } from './DimensionsBlurb';
import { IntroBlurb } from './IntroBlurb';
import { PerformanceBlurb } from './PerformanceBlurb';
import { PowerSupplyBlurb } from './PowerSupplyBlurb';
import { ValueBlurb } from './ValueBlurb';

export const Overview: FunctionComponent = () => {
  const { gpu } = useContext(ViewPageContext);

  return (
    <section className="-mb-4">
      <h2>Overview</h2>

      <IntroBlurb />
      <DimensionsBlurb />
      <PowerSupplyBlurb />
      <PerformanceBlurb />
      <ValueBlurb />
    </section>
  );
};
