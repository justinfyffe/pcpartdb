import { ContentTag } from '@pcpartdb/shared';
import React, { useContext, useMemo } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { formatOrdinalNumber } from '../../../../../shared/format';
import { formatGpuField, getGpuName } from '../../../..';
import { ViewPageContext } from '../../context';

const IntroBlurbSentence1 = compileContentComponent(
  {
    deps: ['gpuName', 'marketSegment', 'releaseDate'],
    tags: [ContentTag.Launched],
    component: (props) => (
      <>
        The {props.gpuName} is a {props.marketSegment} graphics card that
        released during {props.releaseDate}.
      </>
    ),
  },
  {
    deps: ['gpuName', 'marketSegment', 'releaseDate'],
    component: (props) => (
      <>
        The {props.gpuName} is a {props.marketSegment} graphics card will
        released during {props.releaseDate}.
      </>
    ),
  },
  {
    deps: ['company', 'shortGpuName', 'releaseDate'],
    tags: [ContentTag.Launched],
    component: (props) => (
      <>
        The {props.shortGpuName} is a {props.company} graphics card that
        released during {props.releaseDate}.
      </>
    ),
  },
  {
    deps: ['company', 'shortGpuName', 'releaseDate'],
    component: (props) => (
      <>
        The {props.shortGpuName} is a {props.company} graphics card will release
        during {props.releaseDate}.
      </>
    ),
  },
);

const IntroBlurbSentence2 = compileContentComponent(
  {
    deps: ['launchPrice'],
    tags: [ContentTag.Launched],
    component: (props) => (
      <>It launched with prices starting at {props.launchPrice} MSRP.</>
    ),
  },
  {
    deps: ['launchPrice'],
    component: (props) => (
      <>It is expected to have a MSRP of {props.launchPrice}.</>
    ),
  },
);

const IntroBlurbSentence3 = compileContentComponent({
  deps: [
    'architecture',
    'company',
    'marketSegment',
    'performanceRankForArchitectureSegment',
  ],
  component: (props) => (
    <>
      Its the {props.performanceRankForArchitectureSegment} fastest{' '}
      {props.marketSegment} GPU in {props.company}&apos;s {props.architecture}{' '}
      lineup.
    </>
  ),
});

const IntroBlurbSentence4 = compileContentComponent(
  {
    deps: ['architecture', 'codename', 'company', 'processSize'],
    component: (props) => (
      <>
        The {props.codename} chip that powers the GPU uses the {props.company}{' '}
        {props.architecture} architecture and is built on the{' '}
        {props.processSize} process.
      </>
    ),
  },
  {
    deps: ['architecture', 'company', 'processSize'],
    component: (props) => (
      <>
        The chip that powers the {props.shortGpuName} uses the GPU{' '}
        {props.architecture} architecture and is built on the{' '}
        {props.processSize} process.
      </>
    ),
  },
  {
    deps: ['architecture', 'codename', 'company'],
    component: (props) => (
      <>
        The {props.codename} chip that powers the GPU uses the {props.company}{' '}
        {props.architecture} architecture.
      </>
    ),
  },
  {
    deps: ['codename', 'processSize'],
    component: (props) => (
      <>
        The {props.codename} chip that powers the GPU is built on the{' '}
        {props.processSize} process.
      </>
    ),
  },
);

export const IntroBlurb = () => {
  const { gpu, contentData } = useContext(ViewPageContext);

  const context = useMemo(() => {
    const tags = contentData.contentTags;
    const params = {
      architecture: formatGpuField(gpu.architecture),
      codename: formatGpuField(gpu.codename),
      company: formatGpuField(gpu.company),
      gpuName: getGpuName(gpu),
      height: formatGpuField(gpu.height),
      launchPrice: formatGpuField(gpu.launchPrice),
      marketSegment: formatGpuField(gpu.marketSegment)?.toLowerCase(),
      performanceRankForArchitectureSegment:
        gpu.ranks?.performanceRankForArchitectureSegment > 1
          ? formatOrdinalNumber(
              gpu.ranks?.performanceRankForArchitectureSegment,
            )
          : '',
      processSize: formatGpuField(gpu.processSize),
      releaseDate: formatGpuField(gpu.releaseDate),
      shortGpuName: getGpuName(gpu, { company: false }),
      slotWidth: formatGpuField(gpu.slotWidth),
    };

    return { tags, params };
  }, [contentData.contentTags, gpu]);

  return (
    <ContentContext.Provider value={context}>
      <p>
        <IntroBlurbSentence1 /> <IntroBlurbSentence2 /> <IntroBlurbSentence3 />{' '}
      </p>
    </ContentContext.Provider>
  );
};
