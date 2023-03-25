import React, { useContext } from 'react';
import { getGpuName } from '../../../../../../gpus';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../shared/content';
import { ViewPageContext } from '../../../context';

export const ProcessorIntroSentence1 = compileContentComponent({
  deps: ['gpuName'],
  component: (props) => (
    <>General information about {props.gpuName}&apos;s processor.</>
  ),
});

export const ProcessorIntro = () => {
  const { gpu } = useContext(ViewPageContext);

  const params = {
    gpuName: getGpuName(gpu),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <ProcessorIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
