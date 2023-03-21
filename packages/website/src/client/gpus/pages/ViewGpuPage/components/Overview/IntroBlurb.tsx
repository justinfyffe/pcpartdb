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
    'codename',
    'company',
    'gpuName',
    'height',
    'launchPrice',
    'marketSegment',
    'processSize',
    'releaseDate',
    'shortGpuName',
    'slotWidth',
  ],
  component: (props) => (
    <>
      The {props.gpuName} is a {props.marketSegment} graphics card released
      during {props.releaseDate}. It launched with prices starting at{' '}
      {props.launchPrice} MSRP. Its {props.codename} chip that powers the{' '}
      {props.shortGpuName} uses the {props.company} {props.architecture}{' '}
      architecture and built on the {props.processSize} process.
    </>
  ),
});

export const IntroBlurb = () => {
  const { gpu } = useContext(ViewPageContext);

  const context = useMemo(() => {
    const params = {
      architecture: formatGpuField(gpu.specs?.architecture),
      codename: formatGpuField(gpu.specs?.codename),
      company: formatGpuField(gpu.company),
      gpuName: getGpuName(gpu),
      height: formatGpuField(gpu.specs?.height),
      launchPrice: formatGpuField(gpu.launchPrice),
      marketSegment: formatGpuField(gpu.marketSegment).toLowerCase(),
      processSize: formatGpuField(gpu.specs?.processSize),
      releaseDate: formatGpuField(gpu.releaseDate),
      shortGpuName: getGpuName(gpu, { company: false }),
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
