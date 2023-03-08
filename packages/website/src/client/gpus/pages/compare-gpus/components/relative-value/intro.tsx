import React, { useContext } from 'react';
import { getGpuName } from '../../../../../gpus';
import { compileContent, ContentContext } from '../../../../../shared/content';
import { ComparePageContext } from '../../context';

export const ValueIntroSentence1 = compileContent({
  deps: ['gpuName1', 'gpuName2'],
  component: (props) => (
    <>
      Compare {props.gpuName1} and {props.gpuName2}&apos;s value with similar
      GPUs. Relative value provides insight into which GPUs give the better bang
      for your buck.
    </>
  ),
});

export const ValueIntro = () => {
  const { comparison } = useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;

  const params = {
    gpuName1: getGpuName(gpu1),
    gpuName2: getGpuName(gpu2),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <ValueIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
