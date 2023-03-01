import {
  compileContent,
  ContentContext,
  ContentParams,
} from '@pcpartdb/website/client/shared/content';
import React, { useContext } from 'react';
import { ComparePageContext } from '../../../context';

export const ApiSummarySentence1 = compileContent({
  deps: [],
  component: (props) => <></>,
});

export const ApiSummary = () => {
  const { comparison } = useContext(ComparePageContext);

  const params: ContentParams = {};

  return (
    <ContentContext.Provider value={{ params }}>
      <p>
        <ApiSummarySentence1 />
      </p>
    </ContentContext.Provider>
  );
};
