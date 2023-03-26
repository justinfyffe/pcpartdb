import React, { useContext } from 'react';
import { getGpuName } from '../../../../../../gpus';
import {
  compileContentComponent,
  ContentComponentParams,
  ContentContext,
} from '../../../../../../shared/content';
import { ViewPageContext } from '../../../context';

export const ApiSummarySentence1 = compileContentComponent({
  deps: [],
  component: (props) => <></>,
});

export const ApiSummary = () => {
  const { gpu } = useContext(ViewPageContext);

  const params: ContentComponentParams = {
    gpuName: getGpuName(gpu),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p>
        <ApiSummarySentence1 />
      </p>
    </ContentContext.Provider>
  );
};
