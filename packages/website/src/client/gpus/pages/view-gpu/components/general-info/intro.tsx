import React, { useContext } from 'react';
import { getGpuName } from '../../../../../gpus';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { ViewPageContext } from '../../context';

export const GeneralInfoIntroSentence1 = compileContentComponent({
  deps: ['gpuName'],
  component: (props) => (
    <>
      General information about the {props.gpuName} like its performance rating,
      release date, and launch price.
    </>
  ),
});

export const GeneralInfoIntro = () => {
  const { gpu } = useContext(ViewPageContext);

  const params = {
    gpuName: getGpuName(gpu),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <GeneralInfoIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
