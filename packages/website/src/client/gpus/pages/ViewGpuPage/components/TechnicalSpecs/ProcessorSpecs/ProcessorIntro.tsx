import React, { useContext, useMemo } from 'react';
import {
  compileContentComponent,
  ContentContext,
} from '../../../../../../shared/content';
import { getGpuName } from '../../../../..';
import { ViewPageContext } from '../../../context';

export const ProcessorIntroSentence1 = compileContentComponent({
  deps: ['gpuName'],
  component: (props) => (
    <>General information about {props.gpuName}&apos;s processor.</>
  ),
});

export const ProcessorIntro = () => {
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
        <ProcessorIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
