import React, { useContext, useMemo } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { formatGpuField, getGpuName } from '../../../..';
import { ViewPageContext } from '../../context';

const IntroBlurbSentence1 = compileContentComponent({
  deps: [
    'architecture',
    'company',
    'gpuName',
    'height',
    'launchPrice',
    'marketSegment',
    'processSize',
    'releaseDate',
    'slotWidth',
  ],
  component: (props) => (
    <>
      The {props.gpuName} is a high-end {props.marketSegment} graphics card
      released during {props.releaseDate}. Its prices started at{' '}
      {props.launchPrice} MSRP. It is a large GPU, taking up {props.slotWidth}{' '}
      PCIe slots ({props.height}). Its powered by the {props.company}{' '}
      {props.architecture} architecture, built on the {props.processSize}{' '}
      process.
    </>
  ),
});

export const IntroBlurb = () => {
  const { gpu } = useContext(ViewPageContext);

  const context = useMemo(() => {
    const params = {
      architecture: formatGpuField(gpu.specs?.architecture),
      company: formatGpuField(gpu.company),
      gpuName: getGpuName(gpu),
      height: formatGpuField(gpu.specs?.height),
      launchPrice: formatGpuField(gpu.launchPrice),
      marketSegment: formatGpuField(gpu.marketSegment).toLowerCase(),
      processSize: formatGpuField(gpu.specs?.processSize),
      releaseDate: formatGpuField(gpu.releaseDate),
      slotWidth: formatGpuField(gpu.specs?.slotWidth),
    };

    return { params };
  }, [gpu]);

  return (
    <ContentContext.Provider value={context}>
      <p>
        <IntroBlurbSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
