import React, { useContext, useMemo } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../shared/content';
import { getGpuName } from '../../../../..';
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

  const context = useMemo(() => {
    const params = {
      gpuName: getGpuName(gpu),
    };

    return { params };
  }, [gpu]);

  return (
    <ContentContext.Provider value={context}>
      <p className="text-content-dimmed">
        <ApiIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
