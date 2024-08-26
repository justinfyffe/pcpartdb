'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import React, { FunctionComponent } from 'react';
import {
  ProductionStatusTag,
  SpecsTag,
} from '../../../content/buildProductContentTags';
import { useProductContent } from '../../../content/useProductContent';

const MemoryAndCacheTitle = compileContentComponent(
  {
    tags: [SpecsTag.MemorySupport],
    Component: (props) => <h3>Memory and Cache</h3>,
  },
  {
    tags: [SpecsTag.MemoryChannels],
    Component: (props) => <h3>Memory and Cache</h3>,
  },
  {
    tags: [SpecsTag.L1Cache],
    Component: (props) => <h3>Memory and Cache</h3>,
  },
  {
    tags: [SpecsTag.L2Cache],
    Component: (props) => <h3>Memory and Cache</h3>,
  },
  {
    tags: [SpecsTag.L3Cache],
    Component: (props) => <h3>Memory and Cache</h3>,
  },
);

const MemoryAndCacheSentence1 = compileContentComponent(
  {
    // Memory support and memory channels.
    tags: [SpecsTag.MemorySupport, SpecsTag.MemoryChannels],
    deps: ['memorySupport', 'memoryChannels', 'memoryChannelsRaw'],
    Component: (props) => (
      <>
        The {props.nameWithNoCompanyNoTags} supports {props.memorySupport}{' '}
        memory and features a {props.memoryChannels} memory controller, allowing
        it to utilize {props.memoryChannelsRaw} memory modules simultaneously.
      </>
    ),
  },
  {
    // Memory support
    tags: [SpecsTag.MemorySupport],
    deps: ['memorySupport'],
    Component: (props) => (
      <>
        The {props.nameWithNoCompanyNoTags} supports {props.memorySupport}{' '}
        memory.
      </>
    ),
  },
  {
    // Memory channels
    tags: [SpecsTag.MemoryChannels],
    deps: ['memoryChannels', 'memoryChannelsRaw'],
    Component: (props) => (
      <>
        The {props.nameWithNoCompanyNoTags} features a {props.memoryChannels}{' '}
        memory controller, allowing it to utilize {props.memoryChannelsRaw}{' '}
        memory modules simultaneously.
      </>
    ),
  },
);

const MemoryAndCacheSentence2 = compileContentComponent(
  {
    // L1 Cache, L2 Cache, L3 Cache
    tags: [SpecsTag.L1Cache, SpecsTag.L2Cache, SpecsTag.L3Cache],
    deps: ['l1Cache', 'l2Cache', 'l3Cache'],
    Component: (props) => {
      return (
        <>
          In terms of cache, the {props.nameWithNoCompanyNoTags} has multiple
          levels of cache. Its L1 cache, which is the smallest and fastest, is{' '}
          {props.l1Cache} in size, providing rapid access to crucial
          instructions. Its L2 cache, at {props.l2Cache}, is larger but slower
          than the L1. Its L3 cache, a shared resource among the CPU&apos;s
          cores, has a capacity of {props.l3Cache}.
        </>
      );
    },
  },
  {
    // L1 Cache, L2 Cache
    tags: [SpecsTag.L1Cache, SpecsTag.L2Cache],
    deps: ['l1Cache', 'l2Cache'],
    Component: (props) => {
      return (
        <>
          In terms of cache, the {props.nameWithNoCompanyNoTags} has multiple
          levels of cache. Its L1 cache, which is the smallest and fastest, is{' '}
          {props.l1Cache} in size, providing rapid access to crucial
          instructions. Its L2 cache, at {props.l2Cache}, is larger but slower
          than the L1.
        </>
      );
    },
  },
  {
    // L2 Cache, L3 Cache
    tags: [SpecsTag.L2Cache, SpecsTag.L3Cache],
    deps: ['l2Cache', 'l3Cache'],
    Component: (props) => {
      return (
        <>
          In terms of cache, the {props.nameWithNoCompanyNoTags} has multiple
          levels of cache. Its L2 cache is {props.l2Cache} in size and provides
          fast access to instructions and data. Its L3 cache, a shared resource
          among the CPU&apos;s cores, has a capacity of {props.l3Cache}.
        </>
      );
    },
  },
  {
    // L1 Cache, L3 Cache
    tags: [SpecsTag.L1Cache, SpecsTag.L3Cache],
    deps: ['l1Cache', 'l3Cache'],
    Component: (props) => {
      return (
        <>
          In terms of cache, the {props.nameWithNoCompanyNoTags} has multiple
          levels of cache. Its L1 cache, which is the smallest and fastest, is{' '}
          {props.l1Cache} in size, providing rapid access to crucial
          instructions. Its L3 cache, a shared resource among the CPU&apos;s
          cores, has a capacity of {props.l3Cache}.
        </>
      );
    },
  },
  {
    // L1 Cache
    tags: [SpecsTag.L1Cache],
    deps: ['l1Cache'],
    Component: (props) => {
      return (
        <>
          In terms of cache, the {props.nameWithNoCompanyNoTags} has a L1 cache
          of {props.l1Cache} which provides rapid access to crucial
          instructions.
        </>
      );
    },
  },
  {
    // L2 Cache
    tags: [SpecsTag.L2Cache],
    deps: ['l2Cache'],
    Component: (props) => {
      return (
        <>
          In terms of cache, the {props.nameWithNoCompanyNoTags} has a L2 cache
          of {props.l2Cache} in size which provides fast access to instructions
          and data.
        </>
      );
    },
  },
  {
    // L3 Cache
    tags: [SpecsTag.L3Cache],
    deps: ['l3Cache'],
    Component: (props) => {
      return (
        <>
          In terms of cache, the {props.nameWithNoCompanyNoTags} has a L3 cache
          with a capacity of {props.l3Cache}, providing a shared resource to the
          CPU&apos;s cores.
        </>
      );
    },
  },
);

const MemoryAndCacheParagraph = compileContentComponent(
  {
    tags: [SpecsTag.MemorySupport],
    Component: (props) => (
      <p>
        <MemoryAndCacheSentence1 /> <MemoryAndCacheSentence2 />
      </p>
    ),
  },
  {
    tags: [SpecsTag.MemoryChannels],
    Component: (props) => (
      <p>
        <MemoryAndCacheSentence1 /> <MemoryAndCacheSentence2 />
      </p>
    ),
  },
  {
    tags: [SpecsTag.L1Cache],
    Component: (props) => (
      <p>
        <MemoryAndCacheSentence1 /> <MemoryAndCacheSentence2 />
      </p>
    ),
  },
  {
    tags: [SpecsTag.L2Cache],
    Component: (props) => (
      <p>
        <MemoryAndCacheSentence1 /> <MemoryAndCacheSentence2 />
      </p>
    ),
  },
  {
    tags: [SpecsTag.L3Cache],
    Component: (props) => (
      <p>
        <MemoryAndCacheSentence1 /> <MemoryAndCacheSentence2 />
      </p>
    ),
  },
);

interface MemoryAndCacheBlurbProps {
  index?: number;
}

export const MemoryAndCacheBlurb: FunctionComponent<
  MemoryAndCacheBlurbProps
> = (props) => {
  const { contentTags, contentParams } = useProductContent(props.index);

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <MemoryAndCacheTitle />
      <MemoryAndCacheParagraph />
    </ContentProvider>
  );
};
