import React, { useContext } from 'react';
import { getGpuName } from '../../../../../../gpus';
import {
  compileContent,
  ContentContext,
} from '../../../../../../shared/content';
import { ComparePageContext } from '../../../context';

export const CompatibilityIntroSentence1 = compileContent({
  deps: ['gpuName1', 'gpuName2'],
  component: (props) => (
    <>
      {props.gpuName1} and {props.gpuName2}&apos;s dimensions, bus interface,
      power consumption, and output ports. These specs are useful for verifying
      that these GPUs fit within your case and is compatible with your
      motherboard, power supply, and monitor.
    </>
  ),
});

export const CompatibilityIntro = () => {
  const { comparison } = useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;

  const params = {
    gpuName1: getGpuName(gpu1),
    gpuName2: getGpuName(gpu2),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <CompatibilityIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
