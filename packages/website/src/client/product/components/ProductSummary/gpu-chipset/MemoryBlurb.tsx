import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import {
  ContentParams,
  ContentTags,
} from 'packages/website/src/client/shared/content/types';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { FunctionComponent } from 'react';
import { SpecsTag } from '../tags';

const MemorySize = compileContentComponent({
  // Example: The NVIDIA GeForce RTX 3070 has 12 GB of GDDR6X VRAM.
  tags: [SpecsTag.MemorySize],
  component: (props) => {
    return (
      <>
        The {props.name} has {props.memorySize} of {props.memoryType} VRAM.
      </>
    );
  },
});

const MemoryBandwidth = compileContentComponent(
  {
    // Example: Its 1,313 MHz memory clock and 192 bit interface
    //          gives it a bandwidth of 504.2 Gb/s.
    tags: [
      SpecsTag.MemoryClock,
      SpecsTag.MemoryInterface,
      SpecsTag.MemoryBandwidth,
    ],
    component: (props) => (
      <>
        Its {props.memoryClock} memory clock and {props.memoryInterface}{' '}
        interface gives it a bandwidth of {props.memoryBandwidth}.
      </>
    ),
  },
  {
    // Example: Its 1,313 MHz memory clock gives it a bandwidth of 504.2 Gb/s.
    tags: [SpecsTag.MemoryClock, SpecsTag.MemoryBandwidth],
    component: (props) => (
      <>
        Its {props.memoryClock} memory clock gives it a bandwidth of{' '}
        {props.memoryBandwidth}.
      </>
    ),
  },
  {
    // Example: It has a memory clock of 1,313 MHz.
    tags: [SpecsTag.MemoryClock],
    component: (props) => <>Its has a memory clock of {props.memoryClock}.</>,
  },
  {
    // Example: It has a memory bandwidth of 504.2 Gb/s.
    tags: [SpecsTag.MemoryBandwidth],
    component: (props) => <>Its has a bandwidth of {props.memoryBandwidth}.</>,
  },
);

const MemoryConclusion = compileContentComponent(
  {
    // Example: This impacts how much data it can store, and how fast it transfers
    //          the data to and from memory.
    tags: [SpecsTag.MemorySize, SpecsTag.MemoryBandwidth],
    component: () => (
      <>
        This impacts how much data it can store, and how fast it transfers the
        data to and from memory.
      </>
    ),
  },
  {
    // Example: This impacts how much data the graphics card can store.
    tags: [SpecsTag.MemorySize],
    component: () => (
      <>This impacts how much data the graphics card can store.</>
    ),
  },
  {
    // Example: This impacts how fast the graphics card transfers
    //          its data to and from memory.
    tags: [SpecsTag.MemoryBandwidth],
    component: () => (
      <>
        This impacts how fast the graphics card transfers its data to and from
        memory.
      </>
    ),
  },
);

const MemoryParagraph = compileContentComponent({
  tags: [],
  deps: [],
  component: () => (
    <p>
      <MemorySize /> <MemoryBandwidth /> <MemoryConclusion />
    </p>
  ),
});

interface MemoryBlurbProps {
  tags?: ContentTags;
  params?: ContentParams;
}

export const MemoryBlurb: FunctionComponent<MemoryBlurbProps> = (props) => {
  const { tags, params } = props;
  const context = { tags, params };

  return (
    <ContentContext.Provider value={context}>
      <MemoryParagraph />
    </ContentContext.Provider>
  );
};
