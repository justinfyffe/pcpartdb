import { getGpuName } from '@client/part';
import {
  compileContent,
  ContentContext,
  ContentParams,
} from '@client/shared/content';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../../context';

export const ApiSummarySentence1 = compileContent({
  deps: [],
  component: (props) => <></>,
});

export const ApiSummary = () => {
  const { part } = useContext(ViewPageContext);

  const params: ContentParams = {
    partName: getGpuName(part),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p>
        <ApiSummarySentence1 />
      </p>
    </ContentContext.Provider>
  );
};
