import { getGpuName } from '@client/part';
import { compileContent, ContentContext } from '@client/shared/content';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../context';

export const PerformanceIntroSentence1 = compileContent({
  deps: ['partName'],
  component: (props) => (
    <>
      Compare {props.partName}&apos;s performance with similar GPUs. Relative
      performance provides insight into how its benchmarks compare to its peers.
    </>
  ),
});

export const PerformanceIntro = () => {
  const { part } = useContext(ViewPageContext);

  const params = {
    partName: getGpuName(part),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <PerformanceIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
