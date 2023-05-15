import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { ViewPageContext } from '../../context';

const MemorySize = compileContentComponent({
  tags: [],
  deps: ['memorySize'],
  // The NVIDIA GeForce RTX 4070 has 12 GB of GDDR6X VRAM.
  component: (props) => (
    <>
      The {props.gpuName} has {props.memorySize} of {props.memoryType} VRAM.
    </>
  ),
});

const MemoryBandwidth = compileContentComponent(
  {
    tags: [],
    deps: ['memoryClock', 'memoryInterface', 'memoryBandwidth'],
    // Its 1,313 MHz memory clock and 192 bit interface gives it a bandwidth of 504.2 Gb/s.
    component: (props) => (
      <>
        Its {props.memoryClock} memory clock and {props.memoryInterface}{' '}
        interface gives it a bandwidth of {props.memoryBandwidth}.
      </>
    ),
  },
  {
    tags: [],
    deps: ['memoryClock', 'memoryBandwidth'],
    // Its 1,313 MHz memory clock gives it a bandwidth of 504.2 Gb/s.
    component: (props) => (
      <>
        Its {props.memoryClock} memory clock gives it a bandwidth of{' '}
        {props.memoryBandwidth}.
      </>
    ),
  },
  {
    tags: [],
    deps: ['memoryClock'],
    // It has a memory clock of 1,313 MHz.
    component: (props) => <>Its has a memory clock of {props.memoryClock}.</>,
  },
  {
    tags: [],
    deps: ['memoryBandwidth'],
    // It has a memory bandwidth of 504.2 Gb/s.
    component: (props) => <>Its has a bandwidth of {props.memoryBandwidth}.</>,
  },
);

const MemoryConclusion = compileContentComponent(
  {
    tags: [],
    deps: ['memorySize', 'memoryBandwidth'],
    // This impacts how much data it can store, and how fast it transfers
    // the data to and from memory.
    component: () => (
      <>
        This impacts how much data it can store, and how fast it transfers the
        data to and from memory.
      </>
    ),
  },
  {
    tags: [],
    deps: ['memorySize'],
    // This impacts how much data the graphics card can store.
    component: () => (
      <>This impacts how much data the graphics card can store.</>
    ),
  },
  {
    tags: [],
    deps: ['memoryBandwidth'],
    // This impacts how fast the graphics card transfers its data to and from
    // memory.
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

export const MemoryBlurb = () => {
  const { contentParams, contentTags } = useContext(ViewPageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <MemoryParagraph />
    </ContentContext.Provider>
  );
};
