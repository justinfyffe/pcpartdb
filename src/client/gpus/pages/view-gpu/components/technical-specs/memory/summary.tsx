import { formatGpuSpec } from '@client/gpus';
import {
  compileContent,
  ContentContext,
  ContentParams,
} from '@client/shared/content';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../../context';

export const MemorySummarySentence1 = compileContent({
  deps: ['architecture'],
  component: (props) => (
    <>This {props.architecture} GPU has 12 GB of GDDR6 memory.</>
  ),
});

export const MemorySummarySentence2 = compileContent({
  deps: ['memoryClock', 'memoryBandwidth', 'memoryInterface'],
  component: (props) => (
    <>
      This memory is clocked {props.memoryClock} and has a bandwidth of{' '}
      {props.memoryBandwidth} with a {props.memoryInterface} interface.
    </>
  ),
});

export const MemorySummary = () => {
  const { gpu } = useContext(ViewPageContext);

  const params: ContentParams = {
    architecture: formatGpuSpec(gpu.specs?.architecture),
    memoryClock: formatGpuSpec(gpu.specs?.memoryClock),
    memoryBandwidth: formatGpuSpec(gpu.specs?.memoryBandwidth),
    memoryInterface: formatGpuSpec(gpu.specs?.memoryInterface),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p>
        <MemorySummarySentence1 /> <MemorySummarySentence2 />
      </p>
    </ContentContext.Provider>
  );
};
