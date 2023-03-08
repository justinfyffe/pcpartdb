import React, { useContext } from 'react';
import { getGpuName } from '../../../../../../gpus';
import {
  compileContent,
  ContentContext,
  ContentParams,
} from '../../../../../../shared/content';
import { ViewPageContext } from '../../../context';

export const ApiSummarySentence1 = compileContent({
  deps: [],
  component: (props) => <></>,
});

export const ApiSummary = () => {
  const { gpu } = useContext(ViewPageContext);

  const params: ContentParams = {
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
