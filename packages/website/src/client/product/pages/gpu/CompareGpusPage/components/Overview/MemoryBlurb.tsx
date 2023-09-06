import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { useContext } from 'react';
import { CompareGpusContentTag } from '../../content';
import { ComparePageContext } from '../../context/ComparePageContext';

const MemorySize = compileContentComponent(
  {
    tags: [CompareGpusContentTag.DifferentMemorySize],
    deps: ['gpu1MemorySizeMoreOrLess', 'memorySize1', 'memorySize2'],
    // The GeForce RTX 3070 has more memory than the Radeon RX 7900 XTX.
    // It has 8 GB of GDDR6X VRAM, while the RX 7900 XTX has 3 GB of GDDR6 VRAM.
    component: (props) => (
      <>
        The {props.shortGpuName1} has {props.gpu1MemorySizeMoreOrLess} memory
        than the {props.shortGpuName2}. It has {props.memorySize1} of{' '}
        {props.memoryType1} VRAM, while the {props.shortestGpuName2} has{' '}
        {props.memorySize2} of {props.memoryType2} VRAM.
      </>
    ),
  },
  {
    tags: [
      CompareGpusContentTag.SameMemorySize,
      CompareGpusContentTag.SameMemoryType,
    ],
    deps: ['memorySize1', 'memoryType1'],
    // The GeForce RTX 3070 has the same amount of memory as the Radeon RX 7900 XTX with 8 GB of GDDR6 VRAM.
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
    // The GeForce RTX 3070 has the same amount of memory as the Radeon RX 7900 XTX with 8 GB of VRAM.
    component: (props) => (
      <>
        The {props.shortGpuName1} has the same amount of memory as the{' '}
        {props.shortGpuName2} with {props.memorySize1} VRAM.
      </>
    ),
  },
);

const MemoryBandwidth = compileContentComponent(
  {
    tags: [CompareGpusContentTag.DifferentMemoryBandwidth],
    deps: [
      'gpu1MemoryBandwidthFasterOrSlower',
      'memoryBandwidth1',
      'memoryBandwidth2',
    ],
    // The RTX 3070 has a memory bandwidth of 448 GB/s, making it faster than the
    // Radeon RX 7900 XTX's 223 GB/s bandwidth.
    component: (props) => (
      <>
        The {props.shortestGpuName1} has a memory bandwidth of{' '}
        {props.memoryBandwidth1}, which is{' '}
        {props.gpu1MemoryBandwidthFasterOrSlower} than the{' '}
        {props.shortestGpuName2}&apos;s {props.memoryBandwidth2} bandwidth.
      </>
    ),
  },
  {
    tags: [CompareGpusContentTag.SameMemoryBandwidth],
    deps: ['memoryBandwidth1'],
    // Both of these GPUs have a memory bandwidth of 448 GB/s.
    component: (props) => (
      <>
        Both of these GPUs have a memory bandwidth of {props.memoryBandwidth1}.
      </>
    ),
  },
);

const MemoryConclusion = compileContentComponent(
  {
    tags: [
      CompareGpusContentTag.DifferentMemoryBandwidth,
      CompareGpusContentTag.DifferentMemorySize,
    ],
    deps: ['gpu1MemorySizeMoreOrLess', 'gpu1MemoryBandwidthFasterOrSlower'],
    // This means that the RTX 4090 stores more data than the RX 7900 XTX,
    // and is slower to transfer the data to and from memory.
    component: (props) => (
      <>
        This means that the {props.shortestGpuName1} stores{' '}
        {props.gpu1MemorySizeMoreOrLess} data than the {props.shortestGpuName2},
        and is {props.gpu1MemoryBandwidthFasterOrSlower} to transfer the data to
        and from memory.
      </>
    ),
  },
  {
    tags: [
      CompareGpusContentTag.DifferentMemoryBandwidth,
      CompareGpusContentTag.SameMemorySize,
    ],
    deps: ['gpu1MemoryBandwidthFasterOrSlower'],
    // This means that the RTX 4090 stores the same amount of data as the RX 7900 XT,
    // but is faster to transfer the data to and from memory.
    component: (props) => (
      <>
        This means that the {props.shortestGpuName1} stores the same amount of
        data as the {props.shortestGpuName2}, but is{' '}
        {props.gpu1MemoryBandwidthFasterOrSlower} to transfer the data to and
        from memory.
      </>
    ),
  },
  {
    tags: [
      CompareGpusContentTag.SameMemoryBandwidth,
      CompareGpusContentTag.DifferentMemorySize,
    ],
    deps: ['gpu1MemorySizeMoreOrLess'],
    // This means that the RTX 4090 stores more data than the RX 7900 XT,
    // but transfers the data to and from memory at similar speeds.
    component: (props) => (
      <>
        This means that the {props.shortestGpuName1} stores{' '}
        {props.gpu1MemorySizeMoreOrLess} data than the {props.shortestGpuName2},
        but transfers the data to and from memory at similar speeds.
      </>
    ),
  },
  {
    tags: [
      CompareGpusContentTag.SameMemoryBandwidth,
      CompareGpusContentTag.SameMemorySize,
    ],
    deps: ['gpu1MemorySizeMoreOrLess'],
    // This means that the RTX 4090 stores a similar amount of data as the RX 7900 XT,
    // and transfers the data to and from memory at similar speeds.
    component: (props) => (
      <>
        This means that the {props.shortestGpuName1} stores a similar amount of
        data as the {props.shortestGpuName2}, and transfers the data to and from
        memory at similar speeds.
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
  const { contentParams, contentTags } = useContext(ComparePageContext);
  const context = { tags: contentTags, params: contentParams };

  return (
    <ContentContext.Provider value={context}>
      <MemoryParagraph />
    </ContentContext.Provider>
  );
};
