import React, { useContext, useMemo } from 'react';
import {
  compileContentComponent,
  ContentComponentParams,
  ContentContext,
} from '../../../../../../shared/content';
import { formatGpuField } from '../../../../..';
import { ViewPageContext } from '../../../context';

export const MemorySummarySentence1 = compileContentComponent({
  deps: ['architecture'],
  component: (props) => (
    <>This {props.architecture} GPU has 12 GB of GDDR6 memory.</>
  ),
});

export const MemorySummarySentence2 = compileContentComponent({
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

  const context = useMemo(() => {
    const params: ContentComponentParams = {
      architecture: formatGpuField(gpu.specs?.architecture),
      memoryClock: formatGpuField(gpu.specs?.memoryClock),
      memoryBandwidth: formatGpuField(gpu.specs?.memoryBandwidth),
      memoryInterface: formatGpuField(gpu.specs?.memoryInterface),
    };

    return { params };
  }, [gpu]);

  return (
    <ContentContext.Provider value={context}>
      <p>
        <MemorySummarySentence1 /> <MemorySummarySentence2 />
      </p>
    </ContentContext.Provider>
  );
};
