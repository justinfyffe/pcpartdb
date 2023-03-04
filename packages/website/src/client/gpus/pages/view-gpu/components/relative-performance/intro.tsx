import React, { useContext } from 'react';
import { getGpuName } from '../../../../../gpus';
import { compileContent, ContentContext } from '../../../../../shared/content';
import { ViewPageContext } from '../../context';

export const PerformanceIntroSentence1 = compileContent({
  deps: ['gpuName'],
  component: (props) => (
    <>
      Compare {props.gpuName}&apos;s performance with similar GPUs. Relative
      performance provides insight into how its benchmarks compare to its peers.
    </>
  ),
});

export const PerformanceIntro = () => {
  const { gpu } = useContext(ViewPageContext);

  const params = {
    gpuName: getGpuName(gpu),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <PerformanceIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
