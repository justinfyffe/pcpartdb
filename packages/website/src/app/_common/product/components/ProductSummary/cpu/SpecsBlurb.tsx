'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import React, { FunctionComponent } from 'react';
import { SpecsTag } from '../../../content/buildProductContentTags';
import { useProductContent } from '../../../content/useProductContent';

const ClockSentence = compileContentComponent(
  {
    tags: [SpecsTag.Clock, SpecsTag.BoostClock],
    component: (props) => (
      <>
        The {props.name} operates at a {props.clock} clock frequency, and can
        boost to {props.boostClock}.
      </>
    ),
  },
  {
    tags: [SpecsTag.Clock],
    component: (props) => (
      <>
        The {props.name} operates at a {props.clock} clock frequency.
      </>
    ),
  },
);

const ClockMultiplierSentence = compileContentComponent(
  {
    tags: [SpecsTag.UnlockedMultiplier],
    deps: [],
    component: () => (
      <>It has an unlocked multiplier, allowing for overclocking.</>
    ),
  },
  {
    tags: [SpecsTag.LockedMultiplier],
    deps: [],
    component: () => (
      <>Its multiplier is locked, making it incapable of overclocking.</>
    ),
  },
);

const CacheSentence = compileContentComponent(
  {
    tags: [SpecsTag.L1Cache, SpecsTag.L2Cache, SpecsTag.L3Cache],
    component: (props) => (
      <>
        It has {props.l1Cache} of L1 cache, {props.l2Cache} of L2 cache, and{' '}
        {props.l3Cache} of L3 cache.
      </>
    ),
  },
  {
    tags: [SpecsTag.L1Cache, SpecsTag.L2Cache],
    component: (props) => (
      <>
        It has a L1 cache of {props.l1Cache}, and a L2 cache of {props.l2Cache}.
      </>
    ),
  },
  {
    tags: [SpecsTag.L1Cache],
    component: (props) => <>It has a L1 cache of {props.l1Cache}.</>,
  },
);

const MemorySupportSentence = compileContentComponent(
  {
    tags: [SpecsTag.MemorySupport, SpecsTag.MemoryChannels],
    component: (props) => (
      <>
        The {props.nameWithNoCompany} supports {props.memorySupport} memory with
        a {props.memoryChannels} interface.
      </>
    ),
  },
  {
    tags: [SpecsTag.MemorySupport],
    component: (props) => (
      <>
        The {props.nameWithNoCompany} supports {props.memorySupport} memory.
      </>
    ),
  },
  {
    tags: [SpecsTag.MemoryChannels],
    component: (props) => (
      <>
        The {props.nameWithNoCompany} supports a {props.memoryChannels}{' '}
        interface for memory.
      </>
    ),
  },
);

const PciExpressSentence = compileContentComponent({
  tags: [SpecsTag.PciExpress],
  component: (props) => (
    <>
      It uses a {props.pciExpress} connection for communication with other PC
      parts.
    </>
  ),
});

const SpecsParagraph = compileContentComponent({
  tags: [],
  component: () => (
    <p>
      <ClockSentence /> <ClockMultiplierSentence /> <CacheSentence />{' '}
      <MemorySupportSentence /> <PciExpressSentence />
    </p>
  ),
});

interface SpecsBlurbProps {}

export const SpecsBlurb: FunctionComponent<SpecsBlurbProps> = (_props) => {
  const { contentTags, contentParams } = useProductContent();

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <SpecsParagraph />
    </ContentProvider>
  );
};
