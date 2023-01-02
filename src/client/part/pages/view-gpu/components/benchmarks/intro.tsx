import { getGpuName } from '@client/part';
import { compileContent, ContentContext } from '@client/shared/content';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../context';

export const BenchmarksIntroSentence1 = compileContent({
  deps: ['partName'],
  component: (props) => (
    <>
      Performance and benchmark metrics for the {props.partName}. These are
      usually the best indicator for determing a GPUs performance.
    </>
  ),
});

export const BenchmarksIntro = () => {
  const { part } = useContext(ViewPageContext);

  const params = {
    partName: getGpuName(part),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <BenchmarksIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
