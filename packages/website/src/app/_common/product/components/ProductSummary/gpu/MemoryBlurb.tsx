'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import React, { FunctionComponent } from 'react';
import { SpecsTag } from '../../../content/buildProductContentTags';
import { useProductContent } from '../../../content/useProductContent';

const MemoryTitle = compileContentComponent(
  {
    tags: [SpecsTag.MemorySize],
    Component: (props) => <h3>Memory</h3>,
  },
  {
    tags: [SpecsTag.MemoryClock],
    Component: (props) => <h3>Memory</h3>,
  },
  {
    tags: [SpecsTag.MemoryInterface],
    Component: (props) => <h3>Memory</h3>,
  },
  {
    tags: [SpecsTag.MemoryBandwidth],
    Component: (props) => <h3>Memory</h3>,
  },
);

const MemorySentence1 = compileContentComponent(
  {
    // GPU with a memory size, type, and interface.
    tags: [
      SpecsTag.MemorySize,
      SpecsTag.MemoryType,
      SpecsTag.MemoryClock,
      SpecsTag.MemoryInterface,
    ],
    deps: ['memorySize', 'memoryType', 'memoryClock', 'memoryInterface'],
    Component: (props) => {
      return (
        <>
          The {props.nameWithNoCompanyNoBrandNoTags} has {props.memorySize} of{' '}
          {props.memoryType} memory, with a {props.memoryClock} memory clock and
          a {props.memoryInterface} interface.
        </>
      );
    },
  },
  {
    // GPU with a memory size, type, and interface.
    tags: [SpecsTag.MemorySize, SpecsTag.MemoryType, SpecsTag.MemoryInterface],
    deps: ['memorySize', 'memoryType', 'memoryInterface'],
    Component: (props) => {
      return (
        <>
          The {props.nameWithNoCompanyNoBrandNoTags} has {props.memorySize} of{' '}
          {props.memoryType} memory, with a {props.memoryInterface} memory
          interface.
        </>
      );
    },
  },
  {
    // GPU with a memory size, type, and clock.
    tags: [SpecsTag.MemorySize, SpecsTag.MemoryType, SpecsTag.MemoryClock],
    deps: ['memorySize', 'memoryType', 'memoryClock'],
    Component: (props) => {
      return (
        <>
          The {props.nameWithNoCompanyNoBrandNoTags} has {props.memorySize} of{' '}
          {props.memoryType} memory, with a {props.memoryClock} memory clock.
        </>
      );
    },
  },
  {
    // GPU with a memory size, and type.
    tags: [SpecsTag.MemorySize, SpecsTag.MemoryType],
    deps: ['memorySize', 'memoryType'],
    Component: (props) => {
      return (
        <>
          The {props.nameWithNoCompanyNoBrandNoTags} has {props.memorySize} of{' '}
          {props.memoryType} memory.
        </>
      );
    },
  },
  {
    // GPU with only a memory size
    tags: [SpecsTag.MemorySize],
    deps: ['memorySize'],
    Component: (props) => {
      return (
        <>
          The {props.nameWithNoCompanyNoBrandNoTags} has {props.memorySize} of
          memory.
        </>
      );
    },
  },
);

const MemorySentence2 = compileContentComponent(
  {
    // Memory bandwidth calculated from clock and interface.
    tags: [
      SpecsTag.MemoryClock,
      SpecsTag.MemoryInterface,
      SpecsTag.MemoryBandwidth,
    ],
    deps: ['memoryBandwidth'],
    Component: (props) => (
      <>
        This gives it a memory bandwidth of {props.memoryBandwidth}, which
        affects how fast it can transfer data to and from memory.
      </>
    ),
  },
  {
    // Memory bandwidth but we don't know the details.
    tags: [SpecsTag.MemoryBandwidth],
    Component: (props) => (
      <>
        It has a memory bandwidth of {props.memoryBandwidth}, which affects how
        fast it can transfer data to and from memory
      </>
    ),
  },
);

const MemorySentence3 = compileContentComponent(
  {
    tags: [SpecsTag.MemorySize],
    deps: [],
    Component: (props) => {
      return (
        <>
          GPU memory stores temporary data that helps the GPU with complex math
          and graphics operations. More memory is generally better, as not
          having enough can cause performance bottlenecks.
        </>
      );
    },
  },
  {
    tags: [SpecsTag.MemoryClock],
    deps: [],
    Component: (props) => {
      return (
        <>
          GPU memory stores temporary data that helps the GPU with complex math
          and graphics operations. More memory is generally better, as not
          having enough can cause performance bottlenecks.
        </>
      );
    },
  },
  {
    tags: [SpecsTag.MemoryBandwidth],
    deps: [],
    Component: (props) => {
      return (
        <>
          GPU memory stores temporary data that helps the GPU with complex math
          and graphics operations. More memory is generally better, as not
          having enough can cause performance bottlenecks.
        </>
      );
    },
  },
);

const MemoryParagraph = compileContentComponent(
  {
    tags: [SpecsTag.MemorySize],
    Component: (props) => (
      <p>
        <MemorySentence1 /> <MemorySentence2 /> <MemorySentence3 />
      </p>
    ),
  },
  {
    tags: [SpecsTag.MemoryClock],
    Component: (props) => (
      <p>
        <MemorySentence1 /> <MemorySentence2 /> <MemorySentence3 />
      </p>
    ),
  },
  {
    tags: [SpecsTag.MemoryInterface],
    Component: (props) => (
      <p>
        <MemorySentence1 /> <MemorySentence2 /> <MemorySentence3 />
      </p>
    ),
  },
  {
    tags: [SpecsTag.MemoryBandwidth],
    Component: (props) => (
      <p>
        <MemorySentence1 /> <MemorySentence2 /> <MemorySentence3 />
      </p>
    ),
  },
);

interface MemoryBlurbProps {
  index?: number;
}

export const MemoryBlurb: FunctionComponent<MemoryBlurbProps> = (props) => {
  const { contentTags, contentParams } = useProductContent(props.index);

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <MemoryTitle />
      <MemoryParagraph />
    </ContentProvider>
  );
};
