import { getGpuName } from '@pcpartdb/website/client/gpus';
import {
  compileContent,
  ContentContext,
  ContentParams,
} from '@pcpartdb/website/client/shared/content';
import React, { useContext } from 'react';
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
