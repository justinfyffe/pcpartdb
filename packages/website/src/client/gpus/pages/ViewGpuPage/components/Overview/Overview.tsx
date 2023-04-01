import React, { FunctionComponent, useContext } from 'react';
import { getGpuName } from '../../../../utils';
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

      {/* Only show for desktop/workstation gpus? */}
      <h3>
        What are the dimensions for the {getGpuName(gpu, { company: false })}?
      </h3>
      <DimensionsBlurb />

      {/* Only show for desktop/workstation gpus? */}
      <h3>
        Which power supply can run the {getGpuName(gpu, { company: false })}?
      </h3>
      <PowerSupplyBlurb />

      <h3>
        How well does the {getGpuName(gpu, { company: false })} perform? Is it
        worth the money?
      </h3>
      <PerformanceBlurb />
      <ValueBlurb />
    </section>
  );
};
