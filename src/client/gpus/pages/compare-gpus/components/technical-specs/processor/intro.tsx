import { getGpuName } from '@client/gpus';
import { compileContent, ContentContext } from '@client/shared/content';
import React, { useContext } from 'react';
import { ComparePageContext } from '../../../context';

export const ProcessorIntroSentence1 = compileContent({
  deps: ['gpuName1', 'gpuName2'],
  component: (props) => (
    <>
      General information about the processors for the {props.gpuName1} and{' '}
      {props.gpuName2}.
    </>
  ),
});

export const ProcessorIntro = () => {
  const { comparison } = useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;

  const params = {
    gpuName1: getGpuName(gpu1),
    gpuName2: getGpuName(gpu2),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <ProcessorIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
