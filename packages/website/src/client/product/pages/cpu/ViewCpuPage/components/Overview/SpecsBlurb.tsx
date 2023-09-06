import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { useContext } from 'react';
import { ViewCpuContentTag } from '../../content/getContentTags';
import { ViewPageContext } from '../../context/ViewPageContext';

const ClockSentence = compileContentComponent(
  {
    tags: [],
    deps: ['clock', 'boostClock'],
    component: (props) => (
      <>
        The {props.cpuName} operates at a {props.clock} clock frequency, and can
        boost to {props.boostClock}.
      </>
    ),
  },
  {
    tags: [],
    deps: ['clock'],
    component: (props) => (
      <>
        The {props.cpuName} operates at a {props.clock} clock frequency.
      </>
    ),
  },
);

const ClockMultiplierSentence = compileContentComponent({
  tags: [ViewCpuContentTag.HasUnlockedMultiplier],
  deps: [],
  component: (props) => (
    <>It has an unlocked multiplier, allowing for overclocking.</>
  ),
});

const CacheSentence = compileContentComponent(
  {
    tags: [],
    deps: ['l1Cache', 'l2Cache', 'l3Cache'],
    component: (props) => (
      <>
        It has {props.l1Cache} of L1 cache, {props.l2Cache} of L2 cache, and{' '}
        {props.l3Cache} of L3 cache.
      </>
    ),
  },
  {
    tags: [],
    deps: ['l1Cache', 'l2Cache'],
    component: (props) => (
      <>
        It has a L1 cache of {props.l1Cache}, and a L2 cache of {props.l2Cache}.
      </>
    ),
  },
  {
    tags: [],
    deps: ['l1Cache'],
    component: (props) => <>It has a L1 cache of {props.l1Cache}.</>,
  },
);

const MemorySupportSentence = compileContentComponent(
  {
    tags: [],
    deps: ['memorySupport', 'memoryChannels'],
    component: (props) => (
      <>
        The {props.shortCpuName} supports {props.memorySupport} memory with a{' '}
        {props.memoryChannels} interface.
      </>
    ),
  },
  {
    tags: [],
    deps: ['memorySupport'],
    component: (props) => (
      <>
        The {props.cpuName} supports {props.memorySupport} memory.
      </>
    ),
  },
  {
    tags: [],
    deps: ['memoryChannels'],
    component: (props) => (
      <>
        The {props.cpuName} supports a {props.memoryChannels} interface for
        memory.
      </>
    ),
  },
);

const PciExpressSentence = compileContentComponent({
  tags: [],
  deps: ['pciExpress'],
  component: (props) => (
    <>
      It uses a {props.pciExpress} connection for communication with other PC
      parts.
    </>
  ),
});

const SpecsParagraph = compileContentComponent({
  tags: [],
  deps: [],
  component: () => (
    <p>
      <ClockSentence /> <ClockMultiplierSentence /> <CacheSentence />{' '}
      <MemorySupportSentence /> <PciExpressSentence />
    </p>
  ),
});

export const SpecsBlurb = () => {
  const { contentTags, contentParams } = useContext(ViewPageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <SpecsParagraph />
    </ContentContext.Provider>
  );
};
