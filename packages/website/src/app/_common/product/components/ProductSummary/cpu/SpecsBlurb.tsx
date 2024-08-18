'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import React, { FunctionComponent } from 'react';
import { SpecsTag } from '../../../content/buildProductContentTags';
import { useProductContent } from '../../../content/useProductContent';

const SpecsTitle = compileContentComponent(
  {
    tags: [SpecsTag.Clock],
    Component: (props) => <>Technical Specs</>,
  },
  {
    tags: [SpecsTag.BoostClock],
    Component: (props) => <>Technical Specs</>,
  },
  {
    tags: [SpecsTag.UnlockedMultiplier],
    Component: (props) => <>Technical Specs</>,
  },
  {
    tags: [SpecsTag.LockedMultiplier],
    Component: (props) => <>Technical Specs</>,
  },
  {
    tags: [SpecsTag.L1Cache],
    Component: (props) => <>Technical Specs</>,
  },
  {
    tags: [SpecsTag.L2Cache],
    Component: (props) => <>Technical Specs</>,
  },
  {
    tags: [SpecsTag.L3Cache],
    Component: (props) => <>Technical Specs</>,
  },
  {
    tags: [SpecsTag.MemorySupport],
    Component: (props) => <>Technical Specs</>,
  },
  {
    tags: [SpecsTag.MemoryChannels],
    Component: (props) => <>Technical Specs</>,
  },
  {
    tags: [SpecsTag.PciExpress],
    Component: (props) => <>Technical Specs</>,
  },
);

const ClockSentence = compileContentComponent(
  {
    tags: [SpecsTag.Clock, SpecsTag.BoostClock],
    Component: (props) => (
      <>
        The {props.nameWithNoCompanyNoBrandNoTags} operates at a {props.clock}{' '}
        clock frequency, and can boost to {props.boostClock}.
      </>
    ),
  },
  {
    tags: [SpecsTag.Clock],
    Component: (props) => (
      <>
        The {props.nameWithNoCompany} operates at a {props.clock} clock
        frequency.
      </>
    ),
  },
);

const ClockMultiplierSentence = compileContentComponent(
  {
    tags: [SpecsTag.UnlockedMultiplier],
    deps: [],
    Component: () => (
      <>It has an unlocked multiplier, allowing for overclocking.</>
    ),
  },
  {
    tags: [SpecsTag.LockedMultiplier],
    deps: [],
    Component: () => (
      <>Its multiplier is locked, making it incapable of overclocking.</>
    ),
  },
);

const CacheSentence = compileContentComponent(
  {
    tags: [SpecsTag.L1Cache, SpecsTag.L2Cache, SpecsTag.L3Cache],
    Component: (props) => (
      <>
        It has {props.l1Cache} of L1 cache, {props.l2Cache} of L2 cache, and{' '}
        {props.l3Cache} of L3 cache.
      </>
    ),
  },
  {
    tags: [SpecsTag.L1Cache, SpecsTag.L2Cache],
    Component: (props) => (
      <>
        It has a L1 cache of {props.l1Cache}, and a L2 cache of {props.l2Cache}.
      </>
    ),
  },
  {
    tags: [SpecsTag.L1Cache],
    Component: (props) => <>It has a L1 cache of {props.l1Cache}.</>,
  },
);

const MemorySupportSentence = compileContentComponent(
  {
    tags: [SpecsTag.MemorySupport, SpecsTag.MemoryChannels],
    Component: (props) => (
      <>
        This processor supports {props.memorySupport} memory with a{' '}
        {props.memoryChannels} interface.
      </>
    ),
  },
  {
    tags: [SpecsTag.MemorySupport],
    Component: (props) => (
      <>This processor supports {props.memorySupport} memory.</>
    ),
  },
  {
    tags: [SpecsTag.MemoryChannels],
    Component: (props) => (
      <>
        This processor supports a {props.memoryChannels} interface for memory.
      </>
    ),
  },
);

const PciExpressSentence = compileContentComponent({
  tags: [SpecsTag.PciExpress],
  Component: (props) => (
    <>
      It uses a {props.pciExpress} connection for communication with other PC
      parts.
    </>
  ),
});

const SpecsParagraph = compileContentComponent({
  tags: [],
  Component: () => (
    <p>
      <ClockSentence /> <ClockMultiplierSentence /> <CacheSentence />{' '}
      <MemorySupportSentence /> <PciExpressSentence />
    </p>
  ),
});

interface SpecsBlurbProps {
  index?: number;
}

export const SpecsBlurb: FunctionComponent<SpecsBlurbProps> = (props) => {
  const { contentTags, contentParams } = useProductContent(props.index);

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <h3>
        <SpecsTitle />
      </h3>
      <SpecsParagraph />
    </ContentProvider>
  );
};
