import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { CompareGpusContentTag } from '../../content';
import { ComparePageContext } from '../../context';

const MemoryBlurbSentence1 = compileContentComponent(
  {
    tags: [CompareGpusContentTag.DifferentMemorySize],
    deps: ['moreMemorySizeShortGpuName', 'lessMemorySizeShortGpuName'],
    component: (props) => (
      <>
        The {props.moreMemorySizeShortGpuName} has more memory than the{' '}
        {props.lessMemorySizeShortGpuName}.
      </>
    ),
  },
  {
    tags: [
      CompareGpusContentTag.SameMemorySize,
      CompareGpusContentTag.SameMemoryType,
    ],
    deps: ['shortGpuName1', 'shortGpuName2', 'memorySize1', 'memoryType1'],
    component: (props) => (
      <>
        The {props.shortGpuName1} has the same amount of memory as the{' '}
        {props.shortGpuName2} with {props.memorySize1} of {props.memoryType1}{' '}
        VRAM.
      </>
    ),
  },
  {
    tags: [CompareGpusContentTag.SameMemorySize],
    deps: ['shortGpuName1', 'shortGpuName2', 'memorySize1'],
    component: (props) => (
      <>
        The {props.shortGpuName1} has the same amount of memory as the{' '}
        {props.shortGpuName2} with {props.memorySize1} VRAM.
      </>
    ),
  },
);

const MemoryBlurbSentence2 = compileContentComponent(
  {
    tags: [CompareGpusContentTag.DifferentMemoryBandwidth],
    deps: [
      'moreMemorySize',
      'moreMemoryType',
      'moreMemoryBandwidth',
      'moreMemoryClock',
      'moreMemoryInterface',
      'lessMemorySizeShortGpuName',
      'lessMemorySize',
      'lessMemoryType',
      'lessMemoryBandwidth',
      'lessMemoryClock',
      'lessMemoryInterface',
    ],
    component: (props) => (
      <>
        It has {props.moreMemorySize} of {props.moreMemoryType} memory with a
        bandwidth of {props.moreMemoryBandwidth} ({props.moreMemoryInterface}{' '}
        interface, {props.moreMemoryClock} clock), whereas the{' '}
        {props.lessMemorySizeShortGpuName} has {props.lessMemorySize} of{' '}
        {props.lessMemoryType} memory with a bandwidth of{' '}
        {props.lessMemoryBandwidth} ({props.lessMemoryInterface} interface,{' '}
        {props.lessMemoryClock} clock).
      </>
    ),
  },
  {
    tags: [CompareGpusContentTag.DifferentMemoryBandwidth],
    deps: [
      'moreMemorySize',
      'moreMemoryBandwidth',
      'moreMemoryClock',
      'moreMemoryInterface',
      'lessMemorySizeShortGpuName',
      'lessMemorySize',
      'lessMemoryBandwidth',
      'lessMemoryClock',
      'lessMemoryInterface',
    ],
    component: (props) => (
      <>
        It has {props.moreMemorySize} of memory with a bandwidth of{' '}
        {props.moreMemoryBandwidth} ({props.moreMemoryInterface} interface,{' '}
        {props.moreMemoryClock} clock), whereas the{' '}
        {props.lessMemorySizeShortGpuName} has {props.lessMemorySize} of memory
        with a bandwidth of {props.lessMemoryBandwidth} (
        {props.lessMemoryInterface} interface, {props.lessMemoryClock} clock).
      </>
    ),
  },
  {
    tags: [
      CompareGpusContentTag.DifferentMemorySize,
      CompareGpusContentTag.DifferentMemoryBandwidth,
    ],
    deps: [
      'moreMemorySize',
      'moreMemoryBandwidth',
      'lessMemorySizeShortGpuName',
      'lessMemorySize',
      'lessMemoryBandwidth',
    ],
    component: (props) => (
      <>
        It has {props.moreMemorySize} of memory with a bandwidth of{' '}
        {props.moreMemoryBandwidth}, whereas the{' '}
        {props.lessMemorySizeShortGpuName} has {props.lessMemorySize} of memory
        with a bandwidth of {props.lessMemoryBandwidth}.
      </>
    ),
  },
  {
    tags: [
      CompareGpusContentTag.SameMemorySize,
      CompareGpusContentTag.DifferentMemoryBandwidth,
    ],
    deps: [
      'shortGpuName1',
      'shortGpuName2',
      'memoryBandwidth1',
      'memoryBandwidth2',
    ],
    component: (props) => (
      <>
        {props.shortGpuName1}&apos;s memory has a bandwidth of{' '}
        {props.memoryBandwidth1}, whereas the {props.shortGpuName2} has a memory
        bandwidth of {props.memoryBandwidth2}.
      </>
    ),
  },
  {
    tags: [CompareGpusContentTag.SameMemoryBandwidth],
    deps: ['memoryBandwidth1'],
    component: (props) => (
      <>
        Both of these GPUs have the same memory bandwidth rated at{' '}
        {props.memoryBandwidth1}.
      </>
    ),
  },
);

const MemoryBlurbSentence3 = compileContentComponent(
  {
    tags: [
      CompareGpusContentTag.DifferentMemorySize,
      CompareGpusContentTag.MoreMemorySizeAndBandwidth,
    ],
    deps: ['moreMemorySizeShortGpuName'],
    component: (props) => (
      <>
        This means that the {props.moreMemorySizeShortGpuName} can store more
        data and access it faster, which can lead to improved performance in
        games and other applications.
      </>
    ),
  },
  {
    tags: [CompareGpusContentTag.DifferentMemorySize],
    deps: ['moreMemorySizeShortGpuName'],
    component: (props) => (
      <>
        This means that the {props.moreMemorySizeShortGpuName} can store more
        data, which can lead to improved performance in games and other
        applications.
      </>
    ),
  },
);

export const MemoryBlurb = () => {
  const { contentParams, contentTags } = useContext(ComparePageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <p>
        <MemoryBlurbSentence1 /> <MemoryBlurbSentence2 />{' '}
        <MemoryBlurbSentence3 />
      </p>
    </ContentContext.Provider>
  );
};
