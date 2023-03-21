import React, { useContext } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { getGpuName } from '../../../..';
import { ComparePageContext } from '../../context';

export const BenchmarksIntroSentence1 = compileContentComponent({
  deps: ['gpuName1', 'gpuName2'],
  component: (props) => (
    <>
      Performance and benchmark metrics for the {props.gpuName1} and{' '}
      {props.gpuName2}. These are usually the best indicator for determing a
      GPUs performance.
    </>
  ),
});

export const BenchmarksIntro = () => {
  const { comparison } = useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;

  const params = {
    gpuName1: getGpuName(gpu1),
    gpuName2: getGpuName(gpu2),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <BenchmarksIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
