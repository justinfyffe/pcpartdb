import React, { useContext, useMemo } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../shared/content';
import { getGpuName } from '../../../..';
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

  const context = useMemo(() => {
    const params = {
      gpuName: getGpuName(gpu),
    };
    return { params };
  }, [gpu]);

  return (
    <ContentContext.Provider value={context}>
      <p className="text-content-dimmed">
        <GeneralInfoIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
