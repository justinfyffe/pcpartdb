import React, { useContext, useMemo } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { formatGpuField, getGpuName } from '../../../..';
import { ViewPageContext } from '../../context';

const PowerSupplyBlurbSentence1 = compileContentComponent({
  deps: ['company', 'gpuName', 'psu'],
  component: (props) => (
    <>
      {props.company} recommends a power supply of {props.psu} for the{' '}
      {props.gpuName}. Using too low of a power supply can result in system
      crashes or your PC shutting off and potentially damaging your hardware.
      Keep in mind that the GPU is often the biggest power draw for computers.
    </>
  ),
});

export const PowerSupplyBlurb = () => {
  const { gpu } = useContext(ViewPageContext);

  const context = useMemo(() => {
    const params = {
      company: formatGpuField(gpu.company),
      gpuName: getGpuName(gpu),
      psu: formatGpuField(gpu.specs?.suggestedPsu),
    };

    return { params };
  }, [gpu]);

  return (
    <ContentContext.Provider value={context}>
      <p>
        <PowerSupplyBlurbSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
