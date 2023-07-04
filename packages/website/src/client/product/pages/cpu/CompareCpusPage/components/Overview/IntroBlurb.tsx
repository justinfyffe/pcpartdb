import {
  compileContentComponent,
  ContentContext,
} from 'packages/website/src/client/shared/content';
import React, { useContext } from 'react';
import { CompareCpusContentTag } from '../../content';
import { ComparePageContext } from '../../context';

const IntroCpu1 = compileContentComponent(
  {
    tags: [],
    deps: ['coresCount1', 'threadsCount1', 'marketSegment1'],
    component: (props) => (
      <>
        The {props.cpuName1} is a {props.coresCount1}-core (
        {props.threadsCount1}-thread) processor built for the{' '}
        {props.marketSegment1} market.
      </>
    ),
  },
  {
    tags: [],
    deps: ['coresCount1', 'threadsCount1'],
    component: (props) => (
      <>
        The {props.cpuName1} is a {props.coresCount1}-core (
        {props.threadsCount1}-thread) processor.
      </>
    ),
  },
  {
    tags: [],
    deps: ['coresCount1', 'marketSegment1'],
    component: (props) => (
      <>
        The {props.cpuName1} is a {props.coresCount1}-core processor built for
        the {props.marketSegment1} market.
      </>
    ),
  },
  {
    tags: [],
    deps: ['coresCount1'],
    component: (props) => (
      <>
        The {props.cpuName1} is a {props.coresCount1}-core processor.
      </>
    ),
  },
  {
    tags: [],
    deps: ['marketSegment1'],
    component: (props) => (
      <>
        The {props.cpuName1} is a processor built for the {props.marketSegment1}{' '}
        market.
      </>
    ),
  },
  {
    tags: [],
    deps: [],
    component: (props) => (
      <>
        The {props.shortCpuName1} is a processor by {props.company1}.
      </>
    ),
  },
);

const IntroCpu2 = compileContentComponent(
  {
    tags: [],
    deps: ['coresCount2', 'threadsCount2', 'marketSegment2'],
    component: (props) => (
      <>
        The {props.cpuName2} is a {props.coresCount2}-core (
        {props.threadsCount2}-thread) processor built for the{' '}
        {props.marketSegment2} market.
      </>
    ),
  },
  {
    tags: [],
    deps: ['coresCount1', 'threadsCount1'],
    component: (props) => (
      <>
        The {props.cpuName2} is a {props.coresCount2}-core (
        {props.threadsCount2}-thread) processor.
      </>
    ),
  },
  {
    tags: [],
    deps: ['coresCount2', 'marketSegment2'],
    component: (props) => (
      <>
        The {props.cpuName2} is a {props.coresCount2}-core processor built for
        the {props.marketSegment2} market.
      </>
    ),
  },
  {
    tags: [],
    deps: ['coresCount2'],
    component: (props) => (
      <>
        The {props.cpuName2} is a {props.coresCount2}-core processor.
      </>
    ),
  },
  {
    tags: [],
    deps: ['marketSegment2'],
    component: (props) => (
      <>
        The {props.cpuName2} is a processor designed for the{' '}
        {props.marketSegment2} market.
      </>
    ),
  },
  {
    tags: [],
    deps: [],
    component: (props) => (
      <>
        The {props.shortCpuName2} is a processor by {props.company2}.
      </>
    ),
  },
);

const IntroReleaseDate = compileContentComponent(
  {
    tags: [CompareCpusContentTag.DifferentReleaseDate],
    deps: ['releaseDate1', 'releaseDate2', 'cpu2WillReleaseOrWasReleased'],
    component: (props) => (
      <>
        The {props.shortestCpuName1} is the {props.cpu1NewerOrOlder} card of the
        two CPUs, with a release date of {props.releaseDate1}, while the{' '}
        {props.shortestCpuName2} {props.cpu2WillReleaseOrWasReleased} in{' '}
        {props.releaseDate2}.
      </>
    ),
  },
  {
    tags: [CompareCpusContentTag.SameReleaseDate],
    deps: ['releaseDate1'],
    component: (props) => (
      <>They both have release dates of {props.releaseDate1}.</>
    ),
  },
);

const IntroLaunchPrice = compileContentComponent(
  {
    tags: [CompareCpusContentTag.DifferentLaunchPrice],
    deps: ['cpu1LaunchPriceHigherOrLower', 'launchPrice1', 'launchPrice2'],
    component: (props) => (
      <>
        The {props.shortestCpuName1} has a {props.cpu1LaunchPriceHigherOrLower}{' '}
        launch price, at {props.launchPrice1} compared to the{' '}
        {props.shortestCpuName2}&apos;s {props.launchPrice2}.
      </>
    ),
  },
  {
    tags: [CompareCpusContentTag.SameLaunchPrice],
    deps: ['launchPrice1'],
    component: (props) => (
      <>They have the same launch price of {props.launchPrice1}.</>
    ),
  },
);

const IntroArchitecture = compileContentComponent(
  {
    tags: [CompareCpusContentTag.DifferentArchitecture],
    deps: ['architecture1', 'architecture2'],
    component: (props) => (
      <>
        {props.company1}&apos;s {props.shortestCpuName1} is based on the{' '}
        {props.architecture1} microarchitecture, whereas the {props.cpuName2} is
        based on the {props.architecture2}.
      </>
    ),
  },
  {
    tags: [CompareCpusContentTag.SameArchitecture],
    deps: ['architecture1'],
    component: (props) => (
      <>
        The {props.shortestCpuName1} and {props.shortestCpuName2} are based on
        the {props.architecture1} microarchitecture.
      </>
    ),
  },
  {
    tags: [],
    deps: ['architecture1'],
    component: (props) => (
      <>
        {props.company1}&apos;s {props.shortestCpuName1} is based on the{' '}
        {props.architecture1} microarchitecture.
      </>
    ),
  },
  {
    tags: [],
    deps: ['architecture2'],
    component: (props) => (
      <>
        {props.company2}&apos;s {props.shortestCpuName2} is based on the{' '}
        {props.architecture1} microarchitecture.
      </>
    ),
  },
);

const IntroSocket = compileContentComponent(
  {
    tags: [CompareCpusContentTag.DifferentSocket],
    deps: ['socket1', 'socket2'],
    component: (props) => (
      <>
        The {props.shortestCpuName1} requires a {props.socket1} motherboard,
        while the {props.shortestCpuName2} requires a {props.socket2}{' '}
        motherboard.
      </>
    ),
  },
  {
    tags: [CompareCpusContentTag.SameSocket],
    deps: ['socket1'],
    component: (props) => (
      <>These CPUs are both compatible with {props.socket1} motherboards.</>
    ),
  },
  {
    tags: [],
    deps: ['socket1'],
    component: (props) => (
      <>
        The {props.shortestCpuName1} is compatible with {props.socket1}{' '}
        motherboards.
      </>
    ),
  },
  {
    tags: [],
    deps: ['socket2'],
    component: (props) => (
      <>
        The {props.shortestCpuName2} is compatible with {props.socket2}{' '}
        motherboards.
      </>
    ),
  },
);

const IntroIntegratedGraphics = compileContentComponent(
  {
    tags: [CompareCpusContentTag.DifferentIntegratedGraphics],
    deps: ['integratedGraphics1', 'integratedGraphics2'],
    component: (props) => (
      <>
        In terms of graphics, the {props.shortestCpuName1} features{' '}
        {props.integratedGraphics1}, and the {props.shortestCpuName2} features{' '}
        {props.integratedGraphics2}.
      </>
    ),
  },
  {
    tags: [CompareCpusContentTag.SameIntegratedGraphics],
    deps: ['integratedGraphics1'],
    component: (props) => (
      <>
        In terms of graphics, they both feature the same integrated graphics
        solutions, the {props.integratedGraphics1}.
      </>
    ),
  },
  {
    tags: [],
    deps: ['integratedGraphics1'],
    component: (props) => (
      <>
        In terms of graphics, the {props.shortestCpuName1} features the{' '}
        {props.integratedGraphics1} integrated graphics solution.
      </>
    ),
  },
  {
    tags: [],
    deps: ['integratedGraphics2'],
    component: (props) => (
      <>
        In terms of graphics, {props.shortestCpuName2} features the{' '}
        {props.integratedGraphics2} integrated graphics solution.
      </>
    ),
  },
);

const IntroBundledCooler = compileContentComponent(
  {
    tags: [CompareCpusContentTag.DifferentBundledCooler],
    deps: ['bundledCooler1', 'bundledCooler2'],
    component: (props) => (
      <>
        They are both bundled with a cooler. The {props.shortestCpuName1}{' '}
        includes the {props.bundledCooler1}, and the {props.shortestCpuName2}{' '}
        includes the {props.bundledCooler2}.
      </>
    ),
  },
  {
    tags: [CompareCpusContentTag.SameBundledCooler],
    deps: ['bundledCooler1'],
    component: (props) => (
      <>They are bundled with the same {props.bundledCooler1} cooler.</>
    ),
  },
  {
    tags: [],
    deps: ['bundledCooler1'],
    component: (props) => (
      <>
        The {props.shortestCpuName1} is bundled with the {props.bundledCooler1}{' '}
        cooler.
      </>
    ),
  },
  {
    tags: [],
    deps: ['bundledCooler2'],
    component: (props) => (
      <>
        The {props.shortestCpuName2} is bundled with the {props.bundledCooler2}{' '}
        cooler.
      </>
    ),
  },
);

const IntroParagraph = compileContentComponent({
  tags: [],
  deps: [],
  component: () => (
    <>
      <p>
        <IntroCpu1 /> <IntroCpu2 /> <IntroReleaseDate /> <IntroLaunchPrice />
      </p>
      <p>
        <IntroArchitecture /> <IntroSocket /> <IntroIntegratedGraphics />{' '}
        <IntroBundledCooler />
      </p>
    </>
  ),
});

export const IntroBlurb = () => {
  const { contentParams, contentTags } = useContext(ComparePageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <IntroParagraph />
    </ContentContext.Provider>
  );
};
