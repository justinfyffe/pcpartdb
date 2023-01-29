import { getGpuName } from '@client/gpus';
import { compileContent, ContentContext } from '@client/shared/content';
import React, { useContext } from 'react';
import { ComparePageContext } from '../../context';

export const PerformanceIntroSentence1 = compileContent({
  deps: ['gpuName1', 'gpuName2'],
  component: (props) => (
    <>
      Compare {props.gpuName1} and {props.gpuName2}&apos;s performance with
      similar GPUs. Relative performance provides insight into how their
      benchmarks compare to their peers.
    </>
  ),
});

export const PerformanceIntro = () => {
  const { comparison } = useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;

  const params = {
    gpuName1: getGpuName(gpu1),
    gpuName2: getGpuName(gpu2),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <PerformanceIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
