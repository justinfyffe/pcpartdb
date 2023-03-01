import { getGpuName } from '@pcpartdb/website/client/gpus';
import {
  compileContent,
  ContentContext,
} from '@pcpartdb/website/client/shared/content';
import React, { useContext } from 'react';
import { ComparePageContext } from '../../../context';

export const MemoryIntroSentence1 = compileContent({
  deps: ['gpuName1', 'gpuName2'],
  component: (props) => (
    <>
      The memory size, bandwidth, and clock speeds for the {props.gpuName1} and{' '}
      {props.gpuName2}. GPU memory stores graphics data like frames, textures,
      and shadows which helps display rendered images. These specs are critical
      for graphics-intense applications like gaming and 3D modeling.
    </>
  ),
});

export const MemoryIntro = () => {
  const { comparison } = useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;

  const params = {
    gpuName1: getGpuName(gpu1),
    gpuName2: getGpuName(gpu2),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <MemoryIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
