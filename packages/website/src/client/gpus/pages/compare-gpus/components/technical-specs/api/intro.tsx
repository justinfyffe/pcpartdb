import React, { useContext } from 'react';
import { getGpuName } from '../../../../../../gpus';
import {
  compileContent,
  ContentContext,
} from '../../../../../../shared/content';
import { ComparePageContext } from '../../../context';

export const ApiIntroSentence1 = compileContent({
  deps: ['gpuName1', 'gpuName2'],
  component: (props) => (
    <>
      API versions that the {props.gpuName1} and {props.gpuName2} supports.
      Older GPUs may not support recent versions.
    </>
  ),
});

export const ApiIntro = () => {
  const { comparison } = useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;

  const params = {
    gpuName1: getGpuName(gpu1),
    gpuName2: getGpuName(gpu2),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <ApiIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
