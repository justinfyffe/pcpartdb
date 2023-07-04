import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../shared/content';
import { ViewCpuContentTag } from '../../content';
import { ViewPageContext } from '../../context';

const IntroMarketSegment = compileContentComponent(
  {
    tags: [],
    deps: [
      'anUnreleasedOrAnEndOfLife',
      'coresCount',
      'threadsCount',
      'marketSegments',
    ],
    component: (props) => (
      <>
        The {props.cpuName} is {props.anUnreleasedOrAnEndOfLife}{' '}
        {props.coresCount}-core ({props.threadsCount}-thread){' '}
        {props.marketSegments} processor built for the {props.marketSegments}{' '}
        market.
      </>
    ),
  },
  {
    tags: [],
    deps: ['anUnreleasedOrAnEndOfLife', 'coresCount', 'threadsCount'],
    component: (props) => (
      <>
        The {props.cpuName} is {props.anUnreleasedOrAnEndOfLife}{' '}
        {props.coresCount}-core ({props.threadsCount}-thread) processor by{' '}
        {props.company}.
      </>
    ),
  },
  {
    tags: [],
    deps: ['anUnreleasedOrAnEndOfLife', 'coresCount', 'marketSegments'],
    component: (props) => (
      <>
        The {props.cpuName} is {props.anUnreleasedOrAnEndOfLife}{' '}
        {props.coresCount}-core processor built for the {props.marketSegments}{' '}
        market.
      </>
    ),
  },
  {
    tags: [],
    deps: ['anUnreleasedOrAnEndOfLife', 'coresCount'],
    component: (props) => (
      <>
        The {props.shortCpuName} is {props.anUnreleasedOrAnEndOfLife}{' '}
        {props.coresCount}-core processor by {props.company}.
      </>
    ),
  },
  {
    tags: [],
    deps: ['coresCount', 'threadsCount', 'marketSegments'],
    component: (props) => (
      <>
        The {props.cpuName} is a {props.coresCount}-core ({props.threadsCount}
        -thread) processor built for the {props.marketSegments} market.
      </>
    ),
  },
  {
    tags: [],
    deps: ['coresCount', 'threadsCount'],
    component: (props) => (
      <>
        The {props.shortCpuName} is a {props.coresCount}-core (
        {props.threadsCount}-thread) processor by {props.company}.
      </>
    ),
  },
  {
    tags: [],
    deps: ['coresCount', 'marketSegments'],
    component: (props) => (
      <>
        The {props.cpuName} is a {props.coresCount}-core processor built for the{' '}
        {props.marketSegments} market.
      </>
    ),
  },
  {
    tags: [],
    deps: ['coresCount'],
    component: (props) => (
      <>
        The {props.shortCpuName} is a {props.coresCount}-core processor by{' '}
        {props.company}.
      </>
    ),
  },
  {
    tags: [],
    deps: [],
    component: (props) => (
      <>
        The {props.shortCpuName} is a {props.marketSegments} processor by{' '}
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
    component: (props) => (
      <>
        It {props.wasPlannedToLaunchOrLaunchedOrWillLaunch} in{' '}
        {props.releaseDate} with a suggested retail price of {props.launchPrice}
        .
      </>
    ),
  },
  {
    tags: [],
    deps: ['releaseDate', 'wasPlannedToLaunchOrLaunchedOrWillLaunch'],
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
    component: (props) => (
      <>It has a suggested retail price of {props.launchPrice}.</>
    ),
  },
);

const IntroArchitecture = compileContentComponent(
  {
    deps: ['generation', 'architecture'],
    component: (props) => (
      <>
        It is part of {props.company}&apos;s {props.generation} lineup, which is
        based on the {props.architecture} microarchitecture.
      </>
    ),
  },
  {
    deps: ['generation'],
    component: (props) => (
      <>
        It is part of {props.company}&apos;s {props.generation} lineup.
      </>
    ),
  },
  {
    deps: ['architecture'],
    component: (props) => (
      <>It is based on the {props.architecture} microarchitecture.</>
    ),
  },
);

const IntroSocketAndFabrication = compileContentComponent(
  {
    deps: ['socket', 'foundry', 'processSize'],
    component: (props) => (
      <>
        The {props.shortCpuName} is compatible with {props.socket} motherboards
        and is fabricated on {props.foundry}&apos;s {props.processSize}{' '}
        manufacturing process.
      </>
    ),
  },
  {
    deps: ['socket', 'processSize'],
    component: (props) => (
      <>
        The {props.shortCpuName} is compatible with {props.socket} motherboards
        and is fabricated on a {props.processSize} manufacturing process.
      </>
    ),
  },
  {
    deps: ['foundry', 'processSize'],
    component: (props) => (
      <>
        The {props.shortCpuName} is fabricated on {props.foundry}&apos;s{' '}
        {props.processSize} manufacturing process.
      </>
    ),
  },
  {
    deps: ['socket'],
    component: (props) => (
      <>
        The {props.shortCpuName} is compatible with {props.socket} motherboards.
      </>
    ),
  },
  {
    deps: ['processSize'],
    component: (props) => (
      <>
        The {props.shortCpuName} is fabricated on a {props.processSize}{' '}
        manufacturing process.
      </>
    ),
  },
);

const IntroFeatures = compileContentComponent(
  {
    tags: [ViewCpuContentTag.HasBundledCooler],
    deps: ['integratedGraphics', 'bundledCooler'],
    component: (props) => (
      <>
        It features the {props.integratedGraphics} integrated graphics solution
        and is bundled with a {props.bundledCooler} cooler.
      </>
    ),
  },
  {
    tags: [],
    deps: ['integratedGraphics'],
    component: (props) => (
      <>
        It features the {props.integratedGraphics} integrated graphics solution.
      </>
    ),
  },
  {
    tags: [ViewCpuContentTag.HasBundledCooler],
    deps: ['bundledCooler'],
    component: (props) => <>It is bundled a {props.bundledCooler} cooler.</>,
  },
);

const IntroParagraph = compileContentComponent({
  tags: [],
  deps: [],
  component: () => (
    <p>
      <IntroMarketSegment /> <IntroReleaseDateAndMsrp /> <IntroArchitecture />{' '}
      <IntroSocketAndFabrication /> <IntroFeatures />
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
