import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../shared/content';
import { ViewGpuContentTag } from '../../content';
import { ViewPageContext } from '../../context';

const IntroAudience = compileContentComponent(
  {
    tags: [],
    deps: ['anUnreleasedOrAnEndOfLife'],
    // The Geforce RTX 3070 is an unreleased desktop graphics card by NVIDIA.
    component: (props) => (
      <>
        The {props.shortGpuName} is {props.anUnreleasedOrAnEndOfLife}{' '}
        {props.marketSegment} graphics card by {props.company}.
      </>
    ),
  },
  {
    tags: [],
    deps: [],
    // The Geforce RTX 3070 is a desktop graphics card by NVIDIA.
    component: (props) => (
      <>
        The {props.shortGpuName} is a {props.marketSegment} graphics card by{' '}
        {props.company}.
      </>
    ),
  },
);

const IntroReleaseDateAndMsrp = compileContentComponent(
  {
    tags: [],
    deps: [
      'releaseDate',
      'launchPrice',
      'wasPlannedToLaunchOrLaunchedOrWillLaunch',
    ],
    // It launched in Q1 2022 with a price of $1,999 (MSRP).
    component: (props) => (
      <>
        It {props.wasPlannedToLaunchOrLaunchedOrWillLaunch} in{' '}
        {props.releaseDate} with a price of {props.launchPrice} (MSRP).
      </>
    ),
  },
  {
    tags: [],
    deps: ['releaseDate', 'wasPlannedToLaunchOrLaunchedOrWillLaunch'],
    // It launched in Q1 2022.
    component: (props) => (
      <>
        It {props.wasPlannedToLaunchOrLaunchedOrWillLaunch} in{' '}
        {props.releaseDate}.
      </>
    ),
  },
  {
    tags: [],
    deps: ['launchPrice'],
    // It has a launch price of $1,999 (MSRP).
    component: (props) => (
      <>It has a launch price of {props.launchPrice} MSRP.</>
    ),
  },
);

const IntroArchitecture = compileContentComponent(
  {
    deps: ['architecture', 'codename', 'chipsetCompany', 'processSize'],
    component: (props) => (
      <>
        The {props.codename} chip that powers the GPU uses the{' '}
        {props.architecture} architecture by {props.chipsetCompany}, and is
        built on the {props.processSize} process.
      </>
    ),
  },
  {
    deps: ['architecture', 'company', 'processSize'],
    component: (props) => (
      <>
        The chip that powers the {props.shortGpuName} uses the{' '}
        {props.architecture} architecture, and is built on the{' '}
        {props.processSize} process.
      </>
    ),
  },
  {
    deps: ['architecture', 'codename', 'chipsetCompany'],
    component: (props) => (
      <>
        The {props.codename} chip that powers the GPU uses the{' '}
        {props.chipsetCompany} {props.architecture} architecture.
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

const IntroBlurbArchitecturePerformance = compileContentComponent(
  {
    tags: [ViewGpuContentTag.IsRetailModel],
    deps: [
      'chipsetShortestName',
      'architecture',
      'company',
      'marketSegment',
      'performanceRankForArchitectureSegment',
    ],
    component: (props) => (
      <>
        Its based on the {props.chipsetShortestName} chipset which is the{' '}
        {props.performanceRankForArchitectureSegment} fastest{' '}
        {props.marketSegment} GPU in {props.chipsetCompany}&apos;s{' '}
        {props.architecture} lineup.
      </>
    ),
  },
  {
    tags: [ViewGpuContentTag.IsChipset],
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
  },
);

const IntroParagraph = compileContentComponent({
  tags: [],
  deps: [],
  component: () => (
    <p>
      <IntroAudience /> <IntroReleaseDateAndMsrp /> <IntroArchitecture />{' '}
      <IntroBlurbArchitecturePerformance />
    </p>
  ),
});

export const IntroBlurb = () => {
  const { contentTags, contentParams } = useContext(ViewPageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <IntroParagraph />
    </ContentContext.Provider>
  );
};
