import React, { useContext, useMemo } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { formatGpuField } from '../../../..';
import { ViewPageContext } from '../../context';

const PowerSupplyBlurbSentence1 = compileContentComponent({
  deps: ['tdp'],
  component: (props) => (
    <>This GPU has a maximum power consumption of {props.tdp}.</>
  ),
});

const PowerSupplyBlurbSentence2 = compileContentComponent({
  deps: ['company', 'psu'],
  component: (props) => (
    <>
      {props.company} recommends using a power supply of at least {props.psu}{' '}
      with this card. A power supply lower than this can result in system
      crashes and potentially damaging your hardware.
    </>
  ),
});

export const PowerSupplyBlurb = () => {
  const { gpu } = useContext(ViewPageContext);

  const context = useMemo(() => {
    const params = {
      company: formatGpuField(gpu.company),
      psu: formatGpuField(gpu.suggestedPsu),
      tdp: formatGpuField(gpu.thermalDesignPower),
    };

    return { params };
  }, [gpu]);

  return (
    <ContentContext.Provider value={context}>
      <p>
        <PowerSupplyBlurbSentence1 /> <PowerSupplyBlurbSentence2 />
      </p>
    </ContentContext.Provider>
  );
};
