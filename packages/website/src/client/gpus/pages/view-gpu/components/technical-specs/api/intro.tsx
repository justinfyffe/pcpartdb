import React, { useContext } from 'react';
import { getGpuName } from '../../../../../../gpus';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../shared/content';
import { ViewPageContext } from '../../../context';

export const ApiIntroSentence1 = compileContentComponent({
  deps: ['gpuName'],
  component: (props) => (
    <>
      API versions that the {props.gpuName} supports. Older GPUs may not support
      recent versions.
    </>
  ),
});

export const ApiIntro = () => {
  const { gpu } = useContext(ViewPageContext);

  const params = {
    gpuName: getGpuName(gpu),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <ApiIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
