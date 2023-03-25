import React, { useContext } from 'react';
import { getGpuName } from '../../../../../gpus';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { ViewPageContext } from '../../context';

export const BenchmarksIntroSentence1 = compileContentComponent({
  deps: ['gpuName'],
  component: (props) => (
    <>
      Performance and benchmark metrics for the {props.gpuName}. These are
      usually the best indicator for determing a GPUs performance.
    </>
  ),
});

export const BenchmarksIntro = () => {
  const { gpu } = useContext(ViewPageContext);

  const params = {
    gpuName: getGpuName(gpu),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <BenchmarksIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
