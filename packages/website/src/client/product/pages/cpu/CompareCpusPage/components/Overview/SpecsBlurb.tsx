import {
  compileContentComponent,
  ContentContext,
} from 'packages/website/src/client/shared/content';
import React, { useContext } from 'react';
import { CompareCpusContentTag } from '../../content';
import { ComparePageContext } from '../../context';

const ClockSentence = compileContentComponent(
  {
    tags: [CompareCpusContentTag.DifferentTurboClock],
    deps: ['clock1', 'turboClock1', 'clock2', 'turboClock2'],
    component: (props) => (
      <>
        The {props.shortestCpuName1} has a clock frequency of {props.clock1}{' '}
        with {props.turboClock1} boost, whereas the {props.shortestCpuName2} has
        a clock frequency of {props.clock2} with {props.turboClock2} boost.
      </>
    ),
  },
  {
    tags: [CompareCpusContentTag.DifferentClock],
    deps: ['clock1', 'turboClock1', 'clock2', 'turboClock2'],
    component: (props) => (
      <>
        The {props.shortestCpuName1} has a clock frequency of {props.clock1}{' '}
        with {props.turboClock1} boost, whereas the {props.shortestCpuName2} has
        a clock frequency of {props.clock2} with {props.turboClock2} boost.
      </>
    ),
  },
  {
    tags: [CompareCpusContentTag.DifferentClock],
    deps: ['clock1', 'turboClock1', 'clock2'],
    component: (props) => (
      <>
        The {props.shortestCpuName1} has a clock frequency of {props.clock1}{' '}
        with {props.turboClock1} boost, whereas the {props.shortestCpuName2} has
        a clock frequency of {props.clock2}.
      </>
    ),
  },
  {
    tags: [CompareCpusContentTag.DifferentClock],
    deps: ['clock1', 'clock2', 'turboClock2'],
    component: (props) => (
      <>
        The {props.shortestCpuName1} has a clock frequency of {props.clock1},
        whereas the {props.shortestCpuName2} has a clock frequency of{' '}
        {props.clock2} with {props.turboClock2} boost.
      </>
    ),
  },
  {
    tags: [CompareCpusContentTag.DifferentClock],
    deps: ['clock1', 'clock2'],
    component: (props) => (
      <>
        The {props.shortestCpuName1} has a clock frequency of {props.clock1},
        whereas the {props.shortestCpuName2} has a clock frequency of{' '}
        {props.clock2}.
      </>
    ),
  },
  {
    tags: [
      CompareCpusContentTag.SameClock,
      CompareCpusContentTag.SameTurboClock,
    ],
    deps: ['clock1', 'turboClock1'],
    component: (props) => (
      <>
        The {props.shortestCpuName1} and {props.shortestCpuName2} have the same
        clock frequency of {props.clock1} with {props.turboClock1} boost.
      </>
    ),
  },
  {
    tags: [CompareCpusContentTag.SameClock],
    deps: ['clock1', 'turboClock1'],
    component: (props) => (
      <>
        The {props.shortestCpuName1} and {props.shortestCpuName2} have the same
        clock frequency of {props.clock1}. The {props.shortestCpuName1} has a
        boost frequency of {props.turboClock1}.
      </>
    ),
  },
  {
    tags: [CompareCpusContentTag.SameClock],
    deps: ['clock1', 'turboClock2'],
    component: (props) => (
      <>
        The {props.shortestCpuName1} and {props.shortestCpuName2} have the same
        clock frequency of {props.clock1}. The {props.shortestCpuName2} has a
        boost frequency of {props.turboClock2}.
      </>
    ),
  },
  {
    tags: [CompareCpusContentTag.SameClock],
    deps: ['clock1', 'clock2'],
    component: (props) => (
      <>
        The {props.shortestCpuName1} and {props.shortestCpuName2} have the same
        clock frequency of {props.clock1}.
      </>
    ),
  },
  {
    tags: [],
    deps: ['clock1', 'turboClock1'],
    component: (props) => (
      <>
        The {props.shortestCpuName1} has a clock frequency of {props.clock1}{' '}
        with {props.turboClock1} boost.
      </>
    ),
  },
  {
    tags: [],
    deps: ['clock2', 'turboClock2'],
    component: (props) => (
      <>
        The {props.shortestCpuName2} has a clock frequency of {props.clock2}{' '}
        with {props.turboClock2} boost.
      </>
    ),
  },
  {
    tags: [],
    deps: ['clock1'],
    component: (props) => (
      <>
        The {props.shortestCpuName1} has a clock frequency of {props.clock1}.
      </>
    ),
  },
  {
    tags: [],
    deps: ['clock2'],
    component: (props) => (
      <>
        The {props.shortestCpuName2} has a clock frequency of {props.clock2}.
      </>
    ),
  },
);

const ClockMultiplierSentence = compileContentComponent(
  {
    tags: [
      CompareCpusContentTag.CanOverclockCpu1,
      CompareCpusContentTag.CanOverclockCpu2,
    ],
    deps: [],
    component: () => (
      <>
        Both CPUs have an unlocked multiplier, allowing them to be overclocked.
      </>
    ),
  },
  {
    tags: [CompareCpusContentTag.CanOverclockCpu1],
    deps: [],
    component: (props) => (
      <>
        The {props.shortestCpuName1} has an unlocked multiplier, allowing for
        overclocking.
      </>
    ),
  },
  {
    tags: [CompareCpusContentTag.CanOverclockCpu2],
    deps: [],
    component: (props) => (
      <>
        The {props.shortestCpuName2} has an unlocked multiplier, allowing for
        overclocking.
      </>
    ),
  },
);

const CacheSentence = compileContentComponent(
  {
    tags: [CompareCpusContentTag.DifferentL1L2Cache],
    deps: [],
    component: (props) => (
      <>
        The {props.shortestCpuName1} has a L1 cache of {props.l1Cache1} and a L2
        cache of {props.l2Cache1}. This is different from{' '}
        {props.shortestCpuName2}&apos;s L1 cache of {props.l1Cache2} and L2
        cache of {props.l2Cache2}.
      </>
    ),
  },
  {
    tags: [CompareCpusContentTag.SameL1L2Cache],
    deps: [],
    component: (props) => (
      <>
        They have the same size L1 cache of {props.l1Cache1} and L2 cache of{' '}
        {props.l2Cache2}.
      </>
    ),
  },
);

const MemorySupportSentence = compileContentComponent(
  {
    tags: [CompareCpusContentTag.SameMemorySupport],
    deps: ['memorySupport1'],
    component: (props) => <>They both support {props.memorySupport1} memory.</>,
  },
  {
    tags: [],
    deps: ['memorySupport1', 'memorySupport2'],
    component: (props) => (
      <>
        The {props.shortestCpuName1} supports {props.memorySupport1} memory, and
        the {props.shortestCpuName2} supports {props.memorySupport2} memory.
      </>
    ),
  },
  {
    tags: [],
    deps: ['memorySupport1'],
    component: (props) => (
      <>
        The {props.shortestCpuName1} supports {props.memorySupport1} memory.
      </>
    ),
  },
  {
    tags: [],
    deps: ['memorySupport2'],
    component: (props) => (
      <>
        The {props.shortestCpuName2} supports {props.memorySupport2} memory.
      </>
    ),
  },
);

const PciExpressSentence = compileContentComponent(
  {
    tags: [CompareCpusContentTag.SamePciExpress],
    deps: ['pciExpress1'],
    component: (props) => (
      <>
        They both use a {props.pciExpress1} connection for communication with
        other PC parts.
      </>
    ),
  },
  {
    tags: [],
    deps: ['pciExpress1', 'pciExpress2'],
    component: (props) => (
      <>
        The {props.shortestCpuName1} uses a {props.pciExpress1} connection for
        communication with other PC parts; the {props.shortestCpuName2} uses a{' '}
        {props.pciExpress2} connection.
      </>
    ),
  },
  {
    tags: [],
    deps: ['pciExpress1'],
    component: (props) => (
      <>
        The {props.shortestCpuName1} uses a {props.pciExpress1} connection for
        communication with other PC parts.
      </>
    ),
  },
  {
    tags: [],
    deps: ['pciExpress2'],
    component: (props) => (
      <>
        The {props.shortestCpuName2} uses a {props.pciExpress2} connection for
        communication with other PC parts.
      </>
    ),
  },
);

const TdpSentence = compileContentComponent(
  {
    tags: [CompareCpusContentTag.SameTdp],
    deps: ['tdp1'],
    component: (props) => (
      <>They both have a thermal design power (TDP) of {props.tdp1}.</>
    ),
  },
  {
    tags: [],
    deps: ['tdp1', 'tdp2'],
    component: (props) => (
      <>
        The {props.shortestCpuName1} has a thermal design power (TDP) of{' '}
        {props.tdp1}. The {props.shortestCpuName2}&apos;s TDP is {props.tdp2}.
      </>
    ),
  },
  {
    tags: [],
    deps: ['tdp1'],
    component: (props) => (
      <>
        The {props.shortestCpuName1} has a thermal design power (TDP) of{' '}
        {props.tdp1}.
      </>
    ),
  },
  {
    tags: [],
    deps: ['tdp2'],
    component: (props) => (
      <>
        The {props.shortestCpuName1} has a thermal design power (TDP) of{' '}
        {props.tdp2}.
      </>
    ),
  },
);

const SpecsParagraph = compileContentComponent({
  tags: [],
  deps: [],
  component: () => (
    <>
      <p>
        <ClockSentence /> <ClockMultiplierSentence /> <CacheSentence />
      </p>
      <p>
        <MemorySupportSentence /> <PciExpressSentence /> <TdpSentence />
      </p>
    </>
  ),
});

export const SpecsBlurb = () => {
  const { contentParams, contentTags } = useContext(ComparePageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <SpecsParagraph />
    </ContentContext.Provider>
  );
};
